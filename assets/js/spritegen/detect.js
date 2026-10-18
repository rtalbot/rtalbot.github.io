// Sprite frame detection: background masks, connected components, grid slicing.
// Pure functions over ImageData so they are easy to reason about and test.

export function hexToRgb(hex) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

export function rgbToHex({ r, g, b }) {
    return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// Look at the four corners. If any is fully transparent the sheet uses alpha
// for its background; otherwise use the most common corner colour.
export function guessBackground(imageData) {
    const { width, height, data } = imageData;
    const corners = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];
    const counts = new Map();
    for (const [x, y] of corners) {
        const i = (y * width + x) * 4;
        if (data[i + 3] === 0) return null;
        const key = rgbToHex({ r: data[i], g: data[i + 1], b: data[i + 2] });
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    let best = null;
    let bestCount = 0;
    for (const [key, count] of counts) {
        if (count > bestCount) {
            best = key;
            bestCount = count;
        }
    }
    return hexToRgb(best);
}

// 1 = solid pixel, 0 = background. Alpha 0 is always background; when a
// colour is given, pixels within `tolerance` (per channel) of it are too.
export function buildSolidMask(imageData, colour = null, tolerance = 0) {
    const { width, height, data } = imageData;
    const mask = new Uint8Array(width * height);
    for (let p = 0, i = 0; p < mask.length; p++, i += 4) {
        if (data[i + 3] === 0) continue;
        if (colour &&
            Math.abs(data[i] - colour.r) <= tolerance &&
            Math.abs(data[i + 1] - colour.g) <= tolerance &&
            Math.abs(data[i + 2] - colour.b) <= tolerance) {
            continue;
        }
        mask[p] = 1;
    }
    return mask;
}

// Label 8-connected regions of a mask. Returns per-pixel labels (0 = none).
function labelRegions(mask, width, height) {
    const labels = new Int32Array(mask.length);
    const stack = new Int32Array(mask.length);
    let next = 0;
    for (let start = 0; start < mask.length; start++) {
        if (!mask[start] || labels[start]) continue;
        next++;
        let top = 0;
        stack[top++] = start;
        labels[start] = next;
        while (top > 0) {
            const p = stack[--top];
            const x = p % width;
            const y = (p - x) / width;
            for (let dy = -1; dy <= 1; dy++) {
                const ny = y + dy;
                if (ny < 0 || ny >= height) continue;
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    if (nx < 0 || nx >= width) continue;
                    const n = ny * width + nx;
                    if (mask[n] && !labels[n]) {
                        labels[n] = next;
                        stack[top++] = n;
                    }
                }
            }
        }
    }
    return { labels, count: next };
}

// Extend each solid pixel `radius` pixels right and down. Two parts then
// touch (8-connected) exactly when at most `radius` empty pixels separate them.
function dilateForward(mask, width, height, radius) {
    if (radius <= 0) return mask;
    const horiz = new Uint8Array(mask.length);
    for (let y = 0; y < height; y++) {
        const row = y * width;
        let last = -Infinity;
        for (let x = 0; x < width; x++) {
            if (mask[row + x]) last = x;
            if (x - last <= radius) horiz[row + x] = 1;
        }
    }
    const out = new Uint8Array(mask.length);
    for (let x = 0; x < width; x++) {
        let last = -Infinity;
        for (let y = 0; y < height; y++) {
            if (horiz[y * width + x]) last = y;
            if (y - last <= radius) out[y * width + x] = 1;
        }
    }
    return out;
}

// Sprites as bounding boxes of solid pixels. Parts separated by at most `gap`
// empty pixels count as one sprite, so a detached hat or sword stays with its
// body. Boxes come from the real pixels,
// so merged sprites never swallow their neighbours' bounding boxes.
export function findSprites(mask, width, height, gap = 0) {
    const grown = dilateForward(mask, width, height, Math.max(0, gap | 0));
    const { labels, count } = labelRegions(grown, width, height);
    const minX = new Int32Array(count + 1).fill(width);
    const minY = new Int32Array(count + 1).fill(height);
    const maxX = new Int32Array(count + 1).fill(-1);
    const maxY = new Int32Array(count + 1).fill(-1);
    const pixels = new Int32Array(count + 1);
    for (let p = 0; p < mask.length; p++) {
        if (!mask[p]) continue;
        const l = labels[p];
        const x = p % width;
        const y = (p - x) / width;
        pixels[l]++;
        if (x < minX[l]) minX[l] = x;
        if (x > maxX[l]) maxX[l] = x;
        if (y < minY[l]) minY[l] = y;
        if (y > maxY[l]) maxY[l] = y;
    }
    const boxes = [];
    for (let l = 1; l <= count; l++) {
        if (!pixels[l]) continue;
        boxes.push({ x: minX[l], y: minY[l], w: maxX[l] - minX[l] + 1, h: maxY[l] - minY[l] + 1, count: pixels[l] });
    }
    return boxes;
}

// Group boxes into rows (by vertical overlap), each sorted left to right.
export function groupRows(boxes) {
    const sorted = [...boxes].sort((a, b) => a.y - b.y || a.x - b.x);
    const rows = [];
    let row = null;
    for (const box of sorted) {
        const centre = box.y + box.h / 2;
        if (row && centre < row.bottom) {
            row.items.push(box);
            row.bottom = Math.max(row.bottom, box.y + box.h);
        } else {
            row = { bottom: box.y + box.h, items: [box] };
            rows.push(row);
        }
    }
    return rows.map((r) => r.items.sort((a, b) => a.x - b.x));
}

export function sortReadingOrder(boxes) {
    return groupRows(boxes).flat();
}

export function autoDetect(imageData, { colour = null, tolerance = 0, gap = 2, minPixels = 4 } = {}) {
    const mask = buildSolidMask(imageData, colour, tolerance);
    const sprites = findSprites(mask, imageData.width, imageData.height, gap);
    const kept = sprites.filter((b) => b.count >= minPixels);
    return sortReadingOrder(kept).map(({ x, y, w, h }) => ({ x, y, w, h }));
}

// Regular grid of cells. cols/rows of 0 mean "as many as fit".
export function gridSlice(imageWidth, imageHeight, opts) {
    const cellW = Math.max(1, opts.cellW | 0);
    const cellH = Math.max(1, opts.cellH | 0);
    const offX = Math.max(0, opts.offX | 0);
    const offY = Math.max(0, opts.offY | 0);
    const spaceX = Math.max(0, opts.spaceX | 0);
    const spaceY = Math.max(0, opts.spaceY | 0);
    const fitCols = Math.floor((imageWidth - offX + spaceX) / (cellW + spaceX));
    const fitRows = Math.floor((imageHeight - offY + spaceY) / (cellH + spaceY));
    const cols = opts.cols > 0 ? Math.min(opts.cols, fitCols) : fitCols;
    const rows = opts.rows > 0 ? Math.min(opts.rows, fitRows) : fitRows;
    const cells = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells.push({ x: offX + c * (cellW + spaceX), y: offY + r * (cellH + spaceY), w: cellW, h: cellH });
        }
    }
    return cells;
}

// Shrink a rect to the bounds of its solid pixels; null if it is empty.
export function trimRect(mask, maskWidth, rect) {
    let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
    for (let y = rect.y; y < rect.y + rect.h; y++) {
        const row = y * maskWidth;
        for (let x = rect.x; x < rect.x + rect.w; x++) {
            if (!mask[row + x]) continue;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }
    if (maxX < 0) return null;
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}
