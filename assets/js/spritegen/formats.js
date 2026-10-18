// Packing, export builders and import parsers for the sprite sheet generator.

export const ANCHORS = {
    'bottom-center': { x: 0.5, y: 1 },
    'center': { x: 0.5, y: 0.5 },
    'bottom-left': { x: 0, y: 1 },
    'top-left': { x: 0, y: 0 },
};

// Where a w*h frame sits inside a boxW*boxH box so its anchor points line up.
export function anchorOffset(anchor, boxW, boxH, w, h) {
    const a = ANCHORS[anchor] || ANCHORS['bottom-center'];
    return {
        x: Math.round((boxW - w) * a.x),
        y: Math.round((boxH - h) * a.y),
    };
}

export function frameDuration(animFrame, anim) {
    return animFrame.duration > 0 ? animFrame.duration : Math.round(1000 / Math.max(1, anim.fps || 10));
}

function nextPow2(n) {
    let p = 1;
    while (p < n) p *= 2;
    return p;
}

// Simple shelf packer: tallest first, fill rows left to right.
// items: [{key, w, h}] -> {width, height, placements: Map(key -> {x, y})}
export function packShelves(items, padding = 1, powerOfTwo = false) {
    const pad = Math.max(0, padding | 0);
    const sorted = [...items].sort((a, b) => b.h - a.h || b.w - a.w);
    const maxW = sorted.reduce((m, it) => Math.max(m, it.w), 0);
    const area = sorted.reduce((s, it) => s + (it.w + pad) * (it.h + pad), 0);
    let width = Math.max(maxW + pad * 2, Math.ceil(Math.sqrt(area) * 1.1) + pad);
    if (powerOfTwo) width = nextPow2(width);

    const placements = new Map();
    let x = pad, y = pad, shelfH = 0;
    for (const it of sorted) {
        if (x + it.w + pad > width && x > pad) {
            x = pad;
            y += shelfH + pad;
            shelfH = 0;
        }
        placements.set(it.key, { x, y });
        x += it.w + pad;
        shelfH = Math.max(shelfH, it.h);
    }
    let height = Math.max(1, y + shelfH + pad);
    if (powerOfTwo) height = nextPow2(height);
    return { width: Math.max(1, width), height, placements };
}

// entries: [{name, src:{x,y,w,h}, trim:{x,y,w,h}}] in source-image coords.
export function buildAtlas(sourceCanvas, entries, { padding = 1, powerOfTwo = false } = {}) {
    const packed = packShelves(entries.map((e) => ({ key: e.name, w: e.trim.w, h: e.trim.h })), padding, powerOfTwo);
    const canvas = document.createElement('canvas');
    canvas.width = packed.width;
    canvas.height = packed.height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    for (const e of entries) {
        const p = packed.placements.get(e.name);
        ctx.drawImage(sourceCanvas, e.trim.x, e.trim.y, e.trim.w, e.trim.h, p.x, p.y, e.trim.w, e.trim.h);
    }
    return { canvas, placements: packed.placements };
}

// TexturePacker "JSON Hash", plus a Pixi-style `animations` map and our own
// lossless data under meta.spritegen so the file can be re-imported.
export function buildHashJSON({ entries, placements, atlasSize, imageName, source, animations, frames, anchor }) {
    const pivot = ANCHORS[anchor] || ANCHORS['bottom-center'];
    const out = { frames: {}, animations: {}, meta: {} };
    for (const e of entries) {
        const p = placements.get(e.name);
        out.frames[e.name] = {
            frame: { x: p.x, y: p.y, w: e.trim.w, h: e.trim.h },
            rotated: false,
            trimmed: e.trim.w !== e.src.w || e.trim.h !== e.src.h,
            spriteSourceSize: { x: e.trim.x - e.src.x, y: e.trim.y - e.src.y, w: e.trim.w, h: e.trim.h },
            sourceSize: { w: e.src.w, h: e.src.h },
            pivot: { x: pivot.x, y: pivot.y },
        };
    }
    const byId = new Map(frames.map((f) => [f.id, f]));
    const animMeta = {};
    for (const anim of animations) {
        const list = anim.frames.filter((af) => byId.has(af.frameId));
        out.animations[anim.name] = list.map((af) => byId.get(af.frameId).name);
        animMeta[anim.name] = {
            fps: anim.fps,
            loop: anim.loop,
            flipX: !!anim.flipX,
            frames: list.map((af) => ({ name: byId.get(af.frameId).name, duration: frameDuration(af, anim) })),
        };
    }
    out.meta = {
        app: 'https://rjtalbot.com/spritegen',
        version: '2.0',
        image: imageName,
        format: 'RGBA8888',
        size: { w: atlasSize.w, h: atlasSize.h },
        scale: '1',
        spritegen: {
            source: source,
            anchor,
            frames: Object.fromEntries(frames.map((f) => [f.name, { x: f.x, y: f.y, w: f.w, h: f.h }])),
            animations: animMeta,
        },
    };
    return out;
}

// The site's own spritesheets.json + animations.json shapes. That format has
// one frameWidth/frameHeight, so differently sized frames get a box of the
// largest size placed around them by the anchor (clamped to the image).
export function buildLegacyJSON({ frames, animations, sheetName, entityName, imagePath, imageW, imageH, anchor }) {
    const boxW = frames.reduce((m, f) => Math.max(m, f.w), 1);
    const boxH = frames.reduce((m, f) => Math.max(m, f.h), 1);
    const uniform = frames.every((f) => f.w === boxW && f.h === boxH);
    const sprites = {};
    for (const f of frames) {
        let x = f.x, y = f.y;
        if (!uniform) {
            const off = anchorOffset(anchor, boxW, boxH, f.w, f.h);
            x = Math.min(Math.max(0, f.x - off.x), Math.max(0, imageW - boxW));
            y = Math.min(Math.max(0, f.y - off.y), Math.max(0, imageH - boxH));
        }
        sprites[f.name] = { x, y };
    }
    const byId = new Map(frames.map((f) => [f.id, f]));
    const anims = {};
    for (const anim of animations) {
        anims[anim.name] = anim.frames
            .filter((af) => byId.has(af.frameId))
            .map((af) => ({ sprite: byId.get(af.frameId).name, time: +(frameDuration(af, anim) / 1000).toFixed(3) }));
    }
    return {
        spritesheets: {
            [sheetName]: { image: imagePath, frameWidth: boxW, frameHeight: boxH, sprites },
        },
        animations: {
            [entityName]: { spritesheet: sheetName, animations: anims },
        },
    };
}

// One animation as a horizontal strip of equal cells.
export function buildStrip(sourceCanvas, frameList, { anchor = 'bottom-center', flipX = false, padding = 0 } = {}) {
    const boxW = frameList.reduce((m, f) => Math.max(m, f.w), 1);
    const boxH = frameList.reduce((m, f) => Math.max(m, f.h), 1);
    const pad = Math.max(0, padding | 0);
    const canvas = document.createElement('canvas');
    canvas.width = frameList.length * boxW + Math.max(0, frameList.length - 1) * pad;
    canvas.height = boxH;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    frameList.forEach((f, i) => {
        const off = anchorOffset(anchor, boxW, boxH, f.w, f.h);
        const cellX = i * (boxW + pad);
        if (flipX) {
            ctx.save();
            ctx.translate(cellX + boxW - off.x, off.y);
            ctx.scale(-1, 1);
            ctx.drawImage(sourceCanvas, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
            ctx.restore();
        } else {
            ctx.drawImage(sourceCanvas, f.x, f.y, f.w, f.h, cellX + off.x, off.y, f.w, f.h);
        }
    });
    return { canvas, cellW: boxW, cellH: boxH };
}

// ---------------------------------------------------------------------------
// Import. Returns {frames:[{name,x,y,w,h}], animations:[{name,fps,loop,flipX,
// frames:[{name,duration}]}], imagePath?, sheetName?} relative to the image
// whose size is imageW*imageH (null if no image is loaded yet).

function isLegacySheet(v) {
    return v && typeof v === 'object' && 'frameWidth' in v && v.sprites && typeof v.sprites === 'object';
}

function isLegacyAnimations(obj) {
    const values = Object.values(obj || {});
    return values.length > 0 && values.every((v) => v && v.spritesheet && v.animations);
}

export function classifyJSON(json) {
    if (!json || typeof json !== 'object') return null;
    if (json.spritegenProject) return 'project';
    if (json.frames && (Array.isArray(json.frames) || typeof json.frames === 'object') && json.meta) return 'hash';
    if (json.spritesheets && Object.values(json.spritesheets).some(isLegacySheet)) return 'legacy';
    if (Object.values(json).some(isLegacySheet)) return 'legacy-sheets';
    if (isLegacyAnimations(json.animations ? json.animations : json)) return 'legacy-animations';
    return null;
}

function opensSourceSheet(sg, meta, imageW, imageH, imageName) {
    if (!sg || !sg.source) return false;
    if (imageW === null) return true; // no image yet: we will ask for the source sheet
    if (imageName && imageName === sg.source.image) return true;
    if (imageName && imageName === meta.image) return false;
    return imageW === sg.source.w && imageH === sg.source.h;
}

function parseHash(json, imageW, imageH, imageName) {
    const sg = json.meta && json.meta.spritegen;
    const result = { frames: [], animations: [], imagePath: json.meta && json.meta.image };
    // Our own export: if the open image is the original sheet, use the source rects.
    if (opensSourceSheet(sg, json.meta, imageW, imageH, imageName)) {
        result.imagePath = sg.source.image;
        for (const [name, r] of Object.entries(sg.frames || {})) {
            result.frames.push({ name, x: r.x, y: r.y, w: r.w, h: r.h });
        }
    } else {
        const list = Array.isArray(json.frames)
            ? json.frames.map((f) => [f.filename || f.name, f])
            : Object.entries(json.frames);
        list.forEach(([name, f], i) => {
            const r = f.frame || f;
            if (r && Number.isFinite(r.x) && Number.isFinite(r.y)) {
                const w = f.rotated ? r.h : r.w;
                const h = f.rotated ? r.w : r.h;
                result.frames.push({ name: name || `frame_${i}`, x: r.x, y: r.y, w, h });
            }
        });
    }
    if (sg && sg.animations) {
        for (const [name, a] of Object.entries(sg.animations)) {
            result.animations.push({ name, fps: a.fps, loop: a.loop, flipX: a.flipX, frames: a.frames.map((f) => ({ name: f.name, duration: f.duration })) });
        }
    } else if (json.animations) {
        for (const [name, names] of Object.entries(json.animations)) {
            if (Array.isArray(names)) result.animations.push({ name, frames: names.map((n) => ({ name: n })) });
        }
    } else if (json.meta && Array.isArray(json.meta.frameTags)) {
        // Aseprite: frameTags index into the frame list.
        for (const tag of json.meta.frameTags) {
            const slice = result.frames.slice(tag.from, tag.to + 1);
            const durations = Array.isArray(json.frames) ? json.frames : Object.values(json.frames);
            result.animations.push({
                name: tag.name,
                loop: tag.direction === 'pingpong' ? 'pingpong' : 'loop',
                frames: slice.map((f, i) => ({ name: f.name, duration: (durations[tag.from + i] || {}).duration })),
            });
        }
    }
    return result;
}

function parseLegacySheet(sheetName, sheet) {
    const frames = Object.entries(sheet.sprites).map(([name, s]) => ({
        name,
        x: s.x,
        y: s.y,
        w: s.w || s.width || sheet.frameWidth,
        h: s.h || s.height || sheet.frameHeight,
    }));
    return { sheetName, imagePath: sheet.image, frames, animations: [] };
}

function legacyAnimations(animJson, sheetName, singleEntity) {
    const out = [];
    for (const [entity, def] of Object.entries(animJson || {})) {
        if (!def || def.spritesheet !== sheetName) continue;
        for (const [name, list] of Object.entries(def.animations || {})) {
            out.push({
                name: singleEntity ? name : `${entity}_${name}`,
                frames: (list || []).map((f) => ({ name: f.sprite, duration: Math.round((f.time || 0.1) * 1000) })),
            });
        }
    }
    return out;
}

function basename(path) {
    return String(path || '').split(/[\\/]/).pop();
}

// jsons: array of parsed JSON files dropped/selected together.
export function parseImport(jsons, { imageW = null, imageH = null, imageName = '' } = {}) {
    const kinds = jsons.map((j) => ({ json: j, kind: classifyJSON(j) }));
    const project = kinds.find((k) => k.kind === 'project');
    if (project) return { project: project.json };

    const hash = kinds.find((k) => k.kind === 'hash');
    if (hash) return parseHash(hash.json, imageW, imageH, imageName);

    const legacyBundle = kinds.find((k) => k.kind === 'legacy');
    const legacySheets = kinds.find((k) => k.kind === 'legacy-sheets');
    const legacyAnims = kinds.find((k) => k.kind === 'legacy-animations');
    const sheets = legacyBundle ? legacyBundle.json.spritesheets : legacySheets ? legacySheets.json : null;
    if (sheets) {
        const entries = Object.entries(sheets).filter(([, v]) => isLegacySheet(v));
        // Prefer the sheet whose image matches the open image.
        const match = entries.find(([, v]) => imageName && basename(v.image) === imageName) || entries[0];
        const result = parseLegacySheet(match[0], match[1]);
        const animSource = legacyBundle ? legacyBundle.json.animations : legacyAnims ? legacyAnims.json : null;
        if (animSource) {
            const entities = Object.values(animSource).filter((d) => d && d.spritesheet === match[0]);
            result.animations = legacyAnimations(animSource, match[0], entities.length === 1);
        }
        return result;
    }
    if (legacyAnims) {
        throw new Error('That looks like an animations.json on its own. Select it together with its spritesheets.json.');
    }
    throw new Error('Unrecognised JSON. Supported: TexturePacker JSON (hash or array), Aseprite JSON, and this site\'s spritesheets.json/animations.json.');
}
