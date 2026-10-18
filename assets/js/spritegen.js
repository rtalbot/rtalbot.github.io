// Sprite Sheet Generator: find frames on a sheet, build animations, export
// atlases. Self-contained; runs entirely in the browser.
import {
    hexToRgb, rgbToHex, guessBackground, buildSolidMask, autoDetect,
    gridSlice, trimRect, groupRows,
} from './spritegen/detect.js';
import {
    anchorOffset, frameDuration, buildAtlas, buildHashJSON, buildLegacyJSON,
    buildStrip, parseImport,
} from './spritegen/formats.js';

const STORAGE_KEY = 'spritegen.project.v2';
const MAX_UNDO = 100;
const MAX_STORED_IMAGE_BYTES = 1024 * 1024;
const ZOOM_STEPS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24];
const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const HANDLE_CURSORS = { nw: 'nwse-resize', se: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize', n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize' };

// Inputs whose values are remembered with the project.
const SETTING_IDS = [
    'sg-bg-mode', 'sg-bg-colour', 'sg-bg-tol', 'sg-gap', 'sg-min',
    'sg-g-w', 'sg-g-h', 'sg-g-ox', 'sg-g-oy', 'sg-g-sx', 'sg-g-sy', 'sg-g-cols', 'sg-g-rows', 'sg-g-skip', 'sg-g-trim',
    'sg-labels', 'sg-pv-scale', 'sg-anchor', 'sg-pv-bg', 'sg-pv-colour', 'sg-onion',
    'sg-sheet-name', 'sg-pad', 'sg-trim-export', 'sg-pot', 'sg-make-transparent',
];

const EXAMPLES = {
    baddies: { file: 'baddies.png', sheetName: 'baddies', gap: 1, demo: { name: 'shyguy_walk', frames: [0, 1], fps: 6 } },
    mario: { file: 'mario3.gif', sheetName: 'mario', gap: 0, demo: { name: 'mario_walk', frames: [19, 16], fps: 8 } },
};

const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const int = (v, fallback = 0) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
};

function storage(action, value) {
    try {
        if (action === 'get') return window.localStorage.getItem(STORAGE_KEY);
        if (action === 'set') window.localStorage.setItem(STORAGE_KEY, value);
        if (action === 'remove') window.localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (err) {
        return action === 'get' ? null : false;
    }
}

function readFileAs(file, how) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        if (how === 'text') reader.readAsText(file);
        else reader.readAsDataURL(file);
    });
}

function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Could not load that image.'));
        img.src = src;
    });
}

function download(blobOrText, filename, type = 'application/json') {
    const blob = blobOrText instanceof Blob ? blobOrText : new Blob([blobOrText], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed.'))), 'image/png');
    });
}

function safeFileName(name, fallback = 'spritesheet') {
    const clean = String(name || '').trim().replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '');
    return clean || fallback;
}

// How well two rects correspond: overlap as a share of the smaller one, with a
// small bonus for similar size so the tighter match wins ties.
function overlapScore(a, b) {
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (w <= 0 || h <= 0) return 0;
    const inter = w * h;
    const iou = inter / (a.w * a.h + b.w * b.h - inter);
    return inter / Math.min(a.w * a.h, b.w * b.h) + 0.1 * iou;
}

class SpriteGen {
    constructor(root) {
        this.root = root;
        this.baseurl = (root.dataset.baseurl || '').replace(/\/$/, '');

        // Image
        this.image = null;
        this.imageName = '';
        this.imageSrc = null; // persistable src (site URL or small data URL)
        this.source = null; // canvas holding the sheet's pixels
        this.imageData = null;
        this.maskCache = null;

        // Project
        this.frames = [];
        this.animations = [];
        this.currentAnimId = null;
        this.nextId = 1;
        this.selection = new Set();

        // Editor
        this.tool = 'select';
        this.toolBeforePick = 'select';
        this.zoom = 1;
        this.drag = null;
        this.tab = 'auto';
        this.undoStack = [];
        this.redoStack = [];
        this.lastUndoTag = null;
        this.lastUndoAt = 0;
        this.renderQueued = false;
        this.saveTimer = 0;
        this.pendingRestore = null;
        this.pendingImport = null;
        this.stripDragIndex = null;

        // Preview playback
        this.preview = { playing: false, pos: 0, elapsed: 0, lastTs: 0, raf: 0 };

        this.canvas = $('sg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.wrap = $('sg-canvas-wrap');
        this.previewCanvas = $('sg-preview');
        this.previewCtx = this.previewCanvas.getContext('2d');
    }

    init() {
        this.readColours();
        this.bindHeader();
        this.bindDetect();
        this.bindInspector();
        this.bindCanvas();
        this.bindAnimations();
        this.bindPreview();
        this.bindExport();
        this.bindKeyboard();
        this.bindDropAndPaste();
        this.restoreFromStorage();
        this.updateBackgroundUI();
        this.refreshAll();
    }

    readColours() {
        const css = getComputedStyle(document.documentElement);
        const get = (name, fallback) => (css.getPropertyValue(name) || '').trim() || fallback;
        this.colours = {
            frame: get('--c-accent-green', '#8BE367'),
            selected: get('--c-link', '#ff597d'),
            inAnim: get('--c-accent-warning', '#ffa500'),
            text: get('--c-text-primary', '#FCF5E4'),
            dark: get('--c-body-bg', '#131418'),
        };
    }

    // ------------------------------------------------------------------
    // UI wiring

    bindHeader() {
        const imageInput = $('sg-file-image');
        const importInput = $('sg-file-import');
        $('sg-open').addEventListener('click', () => imageInput.click());
        $('sg-empty-open').addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', () => {
            if (imageInput.files[0]) this.openImageFile(imageInput.files[0]);
            imageInput.value = '';
        });
        $('sg-import').addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', () => {
            this.importFiles([...importInput.files]);
            importInput.value = '';
        });

        const menu = $('sg-example-menu');
        this.root.querySelectorAll('[data-example]').forEach((btn) => {
            btn.addEventListener('click', () => {
                menu.open = false;
                this.loadExample(btn.dataset.example);
            });
        });
        document.addEventListener('click', (e) => {
            if (menu.open && !menu.contains(e.target)) menu.open = false;
        });

        $('sg-help-btn').addEventListener('click', () => this.toggleHelp());
        $('sg-help-close').addEventListener('click', () => this.toggleHelp(false));
    }

    bindDetect() {
        this.root.querySelectorAll('.sg-tab').forEach((tab) => {
            tab.addEventListener('click', () => this.setTab(tab.dataset.tab));
        });
        $('sg-bg-mode').addEventListener('change', () => {
            this.maskCache = null;
            this.updateBackgroundUI();
        });
        $('sg-bg-colour').addEventListener('input', () => {
            $('sg-bg-mode').value = 'colour';
            this.maskCache = null;
            this.updateBackgroundUI();
        });
        $('sg-bg-tol').addEventListener('change', () => {
            this.maskCache = null;
        });
        $('sg-bg-pick').addEventListener('click', () => this.setTool(this.tool === 'pick' ? this.toolBeforePick : 'pick'));
        $('sg-detect').addEventListener('click', () => this.runAutoDetect());
        $('sg-slice').addEventListener('click', () => this.runGridSlice());
        ['sg-g-w', 'sg-g-h', 'sg-g-ox', 'sg-g-oy', 'sg-g-sx', 'sg-g-sy', 'sg-g-cols', 'sg-g-rows'].forEach((id) => {
            $(id).addEventListener('input', () => this.updateGridStatus());
        });
        SETTING_IDS.forEach((id) => $(id).addEventListener('change', () => this.scheduleSave()));
    }

    bindInspector() {
        $('sg-f-name').addEventListener('change', (e) => this.renameSelected(e.target.value));
        ['x', 'y', 'w', 'h'].forEach((key) => {
            $(`sg-f-${key}`).addEventListener('change', (e) => this.setSelectedRect(key, int(e.target.value)));
        });
        $('sg-add-to-anim').addEventListener('click', () => this.addSelectionToAnimation());
        $('sg-trim').addEventListener('click', () => this.trimSelection());
        $('sg-delete').addEventListener('click', () => this.deleteSelection());
        $('sg-select-all').addEventListener('click', () => this.selectAll());
        $('sg-rename-all').addEventListener('click', () => this.renameAll());
        $('sg-clear').addEventListener('click', () => this.clearFrames());
    }

    bindCanvas() {
        this.root.querySelectorAll('[data-tool]').forEach((btn) => {
            btn.addEventListener('click', () => this.setTool(btn.dataset.tool));
        });
        $('sg-zoom-in').addEventListener('click', () => this.stepZoom(1));
        $('sg-zoom-out').addEventListener('click', () => this.stepZoom(-1));
        $('sg-zoom-fit').addEventListener('click', () => this.zoomToFit());
        $('sg-labels').addEventListener('change', () => this.requestRender());
        $('sg-undo').addEventListener('click', () => this.undo());
        $('sg-redo').addEventListener('click', () => this.redo());

        this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
        this.canvas.addEventListener('pointercancel', () => this.cancelDrag());
        this.canvas.addEventListener('pointerleave', () => {
            if (!this.drag) $('sg-status-cursor').textContent = '';
        });
        this.canvas.addEventListener('dblclick', (e) => {
            const hit = this.frameAt(this.toImage(e));
            if (hit && this.tool === 'select') this.addToAnimation([hit.id]);
        });
        this.wrap.addEventListener('wheel', (e) => {
            if (!this.image || !(e.ctrlKey || e.metaKey)) return;
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.25 : 0.8;
            this.setZoom(this.zoom * factor, e.clientX, e.clientY);
        }, { passive: false });
    }

    bindAnimations() {
        $('sg-anim-select').addEventListener('change', (e) => {
            this.currentAnimId = int(e.target.value, null);
            this.resetPreview();
            this.refreshAnimations();
            this.scheduleSave();
        });
        $('sg-anim-new').addEventListener('click', () => this.newAnimation());
        $('sg-anim-delete').addEventListener('click', () => this.deleteAnimation());
        $('sg-anim-name').addEventListener('change', (e) => this.renameAnimation(e.target.value));
        $('sg-anim-fps').addEventListener('change', (e) => this.updateAnim({ fps: clamp(int(e.target.value, 10), 1, 60) }));
        $('sg-anim-loop').addEventListener('change', (e) => this.updateAnim({ loop: e.target.value }));
        $('sg-anim-flip').addEventListener('change', (e) => this.updateAnim({ flipX: e.target.checked }));
        $('sg-anim-from-rows').addEventListener('click', () => this.animationsFromRows());
        $('sg-anim-clear').addEventListener('click', () => {
            const anim = this.currentAnim();
            if (!anim || !anim.frames.length) return;
            this.pushUndo();
            anim.frames = [];
            this.resetPreview();
            this.commit({ anims: true });
        });

        const strip = $('sg-strip');
        strip.addEventListener('dragover', (e) => this.onStripDragOver(e));
        strip.addEventListener('drop', (e) => this.onStripDrop(e));
        strip.addEventListener('dragleave', (e) => {
            if (!strip.contains(e.relatedTarget)) this.clearDropMarks();
        });
    }

    bindPreview() {
        $('sg-play').addEventListener('click', () => this.togglePlay());
        $('sg-prev').addEventListener('click', () => this.stepPreview(-1));
        $('sg-next').addEventListener('click', () => this.stepPreview(1));
        ['sg-pv-scale', 'sg-anchor', 'sg-pv-bg', 'sg-onion'].forEach((id) => {
            $(id).addEventListener('change', () => this.renderPreview());
        });
        $('sg-pv-colour').addEventListener('input', () => {
            $('sg-pv-bg').value = 'custom';
            this.renderPreview();
        });
        if ('ResizeObserver' in window) {
            new ResizeObserver(() => this.renderPreview()).observe(this.previewCanvas);
        }
    }

    bindExport() {
        $('sg-exp-atlas').addEventListener('click', () => this.exportAtlas({ png: true, json: true }));
        $('sg-exp-png').addEventListener('click', () => this.exportAtlas({ png: true, json: false }));
        $('sg-exp-json').addEventListener('click', () => this.exportAtlas({ png: false, json: true }));
        $('sg-exp-strip').addEventListener('click', () => this.exportStrip());
        $('sg-exp-legacy').addEventListener('click', () => this.exportLegacy());
    }

    bindKeyboard() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    bindDropAndPaste() {
        const hint = $('sg-drop-hint');
        let depth = 0;
        const hasFiles = (e) => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
        this.wrap.addEventListener('dragenter', (e) => {
            if (!hasFiles(e)) return;
            depth++;
            hint.hidden = false;
        });
        this.wrap.addEventListener('dragleave', () => {
            depth = Math.max(0, depth - 1);
            if (!depth) hint.hidden = true;
        });
        this.wrap.addEventListener('dragover', (e) => {
            if (hasFiles(e)) e.preventDefault();
        });
        this.wrap.addEventListener('drop', (e) => {
            if (!hasFiles(e)) return;
            e.preventDefault();
            depth = 0;
            hint.hidden = true;
            this.importFiles([...e.dataTransfer.files]);
        });
        document.addEventListener('paste', (e) => {
            if (e.target.closest && e.target.closest('input, textarea')) return;
            const item = [...(e.clipboardData ? e.clipboardData.items : [])].find((it) => it.type.startsWith('image/'));
            if (item) this.openImageFile(item.getAsFile(), 'pasted.png');
        });
    }

    // ------------------------------------------------------------------
    // Loading images and projects

    async openImageFile(file, fallbackName) {
        try {
            const dataUrl = await readFileAs(file, 'dataurl');
            const name = file.name || fallbackName || 'image.png';
            const keepSrc = file.size <= MAX_STORED_IMAGE_BYTES ? dataUrl : null;
            await this.setImage(dataUrl, name, keepSrc);
            this.afterNewImage();
        } catch (err) {
            this.toast(err.message || 'Could not open that image.', true);
        }
    }

    async loadExample(key) {
        const ex = EXAMPLES[key];
        if (!ex) return;
        const url = `${this.baseurl}/assets/img/${ex.file}`;
        try {
            await this.setImage(url, ex.file, url);
        } catch (err) {
            this.toast(err.message, true);
            return;
        }
        $('sg-bg-mode').value = 'auto';
        $('sg-gap').value = String(ex.gap);
        $('sg-sheet-name').value = ex.sheetName;
        this.updateBackgroundUI();
        this.setTab('auto');
        this.runAutoDetect({ quiet: true, keepAnimations: false });
        const demoFrames = ex.demo.frames.map((i) => this.frames[i]).filter(Boolean);
        if (demoFrames.length) {
            const anim = this.createAnimation(ex.demo.name);
            anim.fps = ex.demo.fps;
            anim.frames = demoFrames.map((f) => ({ frameId: f.id, duration: 0 }));
            this.selection = new Set(demoFrames.map((f) => f.id));
        }
        this.undoStack = [];
        this.redoStack = [];
        this.commit({ frames: true, anims: true });
        this.resetPreview();
        this.play();
        this.toast(`Found ${this.frames.length} frames. Select some and press A to add them to the animation.`);
    }

    // Loads pixels; does not touch frames. `persistSrc` is what autosave keeps.
    async setImage(src, name, persistSrc) {
        const img = await loadImageElement(src);
        this.image = img;
        this.imageName = name;
        this.imageSrc = persistSrc || null;
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const cx = c.getContext('2d', { willReadFrequently: true });
        cx.drawImage(img, 0, 0);
        this.source = c;
        this.imageData = cx.getImageData(0, 0, c.width, c.height);
        this.maskCache = null;
        $('sg-empty').hidden = true;
        $('sg-stage').hidden = false;
        this.zoomToFit();
        this.updateBackgroundUI();
        this.updateGridStatus();
    }

    // A freshly opened image: start a new project, unless it matches a
    // project waiting to be restored or imported.
    afterNewImage() {
        this.undoStack = [];
        this.redoStack = [];
        this.stopPreview();
        const pending = this.pendingRestore;
        if (pending && pending.image && pending.image.name === this.imageName &&
            pending.image.w === this.source.width && pending.image.h === this.source.height) {
            this.applyProject(pending);
            this.pendingRestore = null;
            this.toast(`Restored ${this.frames.length} frames from your last session.`);
            return;
        }
        this.frames = [];
        this.animations = [];
        this.currentAnimId = null;
        this.selection.clear();
        $('sg-sheet-name').value = safeFileName(this.imageName.replace(/\.[^.]+$/, ''));
        if (this.pendingImport) {
            const jsons = this.pendingImport;
            this.pendingImport = null;
            this.applyImportedJSON(jsons);
            return;
        }
        this.commit({ frames: true, anims: true });
        this.toast(`Opened ${this.imageName}. Press "Detect frames" or slice a grid.`);
    }

    async importFiles(files) {
        const imageFile = files.find((f) => f.type.startsWith('image/'));
        const jsonFiles = files.filter((f) => f.type === 'application/json' || /\.json$/i.test(f.name));
        if (!jsonFiles.length) {
            if (imageFile) this.openImageFile(imageFile);
            else this.toast('Choose an image or a JSON file.', true);
            return;
        }
        let jsons;
        try {
            jsons = await Promise.all(jsonFiles.map(async (f) => JSON.parse(await readFileAs(f, 'text'))));
        } catch (err) {
            this.toast('That JSON file could not be read.', true);
            return;
        }
        if (imageFile) {
            this.pendingImport = jsons;
            await this.openImageFile(imageFile);
            return;
        }
        if (this.image) {
            this.applyImportedJSON(jsons);
            return;
        }
        // No image yet: the JSON may name one that lives on this site.
        let parsed;
        try {
            parsed = parseImport(jsons, {});
        } catch (err) {
            this.toast(err.message, true);
            return;
        }
        const path = parsed.project ? parsed.project.image && parsed.project.image.src : parsed.imagePath;
        const siteImage = path && /^\/?assets\//.test(path) ? `${this.baseurl}/${path.replace(/^\//, '')}` : null;
        this.pendingImport = jsons;
        if (siteImage) {
            try {
                await this.setImage(siteImage, path.split('/').pop(), siteImage);
                this.afterNewImage();
                return;
            } catch (err) {
                // fall through and ask for the image
            }
        }
        const wanted = path ? ` (${String(path).split('/').pop()})` : '';
        this.toast(`Now open the image this JSON describes${wanted}.`);
    }

    applyImportedJSON(jsons) {
        let parsed;
        try {
            parsed = parseImport(jsons, { imageW: this.source.width, imageH: this.source.height, imageName: this.imageName });
        } catch (err) {
            this.toast(err.message, true);
            this.commit({ frames: true, anims: true });
            return;
        }
        if (parsed.project) {
            this.applyProject(parsed.project);
            this.toast(`Imported ${this.frames.length} frames.`);
            return;
        }
        this.pushUndo();
        const W = this.source.width;
        const H = this.source.height;
        this.frames = [];
        this.selection.clear();
        const byName = new Map();
        let dropped = 0;
        for (const f of parsed.frames) {
            const x = clamp(Math.round(f.x), 0, W - 1);
            const y = clamp(Math.round(f.y), 0, H - 1);
            const w = clamp(Math.round(f.w), 1, W - x);
            const h = clamp(Math.round(f.h), 1, H - y);
            if (!(f.w > 0 && f.h > 0)) {
                dropped++;
                continue;
            }
            const frame = this.makeFrame({ x, y, w, h }, f.name);
            byName.set(f.name, frame);
            this.frames.push(frame);
        }
        this.animations = [];
        this.currentAnimId = null;
        for (const a of parsed.animations) {
            const anim = this.createAnimation(a.name);
            if (a.fps) anim.fps = clamp(int(a.fps, 10), 1, 60);
            if (a.loop) anim.loop = a.loop;
            anim.flipX = !!a.flipX;
            anim.frames = a.frames
                .filter((af) => byName.has(af.name))
                .map((af) => ({ frameId: byName.get(af.name).id, duration: af.duration > 0 ? Math.round(af.duration) : 0 }));
            // Store durations that equal the default as "use default".
            const def = Math.round(1000 / anim.fps);
            anim.frames.forEach((af) => {
                if (af.duration === def) af.duration = 0;
            });
        }
        if (this.animations.length) this.currentAnimId = this.animations[0].id;
        if (parsed.sheetName) $('sg-sheet-name').value = parsed.sheetName;
        this.resetPreview();
        this.commit({ frames: true, anims: true });
        const extra = dropped ? ` (${dropped} skipped)` : '';
        this.toast(`Imported ${this.frames.length} frames and ${this.animations.length} animations${extra}.`);
    }

    restoreFromStorage() {
        const raw = storage('get');
        if (!raw) return;
        let project;
        try {
            project = JSON.parse(raw);
        } catch (err) {
            return;
        }
        if (!project || !project.spritegenProject) return;
        this.applySettings(project.settings || {});
        const img = project.image;
        if (img && img.src) {
            this.setImage(img.src, img.name, img.src)
                .then(() => {
                    this.applyProject(project);
                    if (this.frames.length) this.toast(`Restored ${img.name} with ${this.frames.length} frames.`);
                })
                .catch(() => {
                    this.pendingRestore = project;
                });
        } else if (img && project.frames && project.frames.length) {
            this.pendingRestore = project;
            this.toast(`Open ${img.name} again to continue where you left off.`);
        }
    }

    projectSnapshot(includeSettings = true) {
        const data = {
            spritegenProject: 2,
            image: this.source ? { name: this.imageName, src: this.imageSrc, w: this.source.width, h: this.source.height } : null,
            frames: this.frames,
            animations: this.animations,
            currentAnimId: this.currentAnimId,
            nextId: this.nextId,
        };
        if (includeSettings) data.settings = this.collectSettings();
        return data;
    }

    applyProject(project) {
        const W = this.source ? this.source.width : Infinity;
        const H = this.source ? this.source.height : Infinity;
        this.frames = (project.frames || [])
            .filter((f) => f && f.w > 0 && f.h > 0 && f.x < W && f.y < H)
            .map((f) => ({ id: f.id, name: String(f.name), x: f.x, y: f.y, w: Math.min(f.w, W - f.x), h: Math.min(f.h, H - f.y) }));
        const ids = new Set(this.frames.map((f) => f.id));
        this.animations = (project.animations || []).map((a) => ({
            id: a.id,
            name: String(a.name),
            fps: clamp(int(a.fps, 10), 1, 60),
            loop: ['loop', 'pingpong', 'once'].includes(a.loop) ? a.loop : 'loop',
            flipX: !!a.flipX,
            frames: (a.frames || []).filter((af) => ids.has(af.frameId)).map((af) => ({ frameId: af.frameId, duration: Math.max(0, int(af.duration)) })),
        }));
        const maxId = Math.max(0, ...this.frames.map((f) => f.id), ...this.animations.map((a) => a.id));
        this.nextId = Math.max(int(project.nextId, 1), maxId + 1);
        this.currentAnimId = this.animations.some((a) => a.id === project.currentAnimId)
            ? project.currentAnimId
            : (this.animations[0] ? this.animations[0].id : null);
        this.selection.clear();
        this.resetPreview();
        this.commit({ frames: true, anims: true, save: false });
    }

    collectSettings() {
        const out = {};
        for (const id of SETTING_IDS) {
            const el = $(id);
            out[id] = el.type === 'checkbox' ? el.checked : el.value;
        }
        return out;
    }

    applySettings(settings) {
        for (const id of SETTING_IDS) {
            if (!(id in settings)) continue;
            const el = $(id);
            if (el.type === 'checkbox') el.checked = !!settings[id];
            else el.value = settings[id];
        }
    }

    scheduleSave() {
        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => this.save(), 400);
    }

    save() {
        const data = this.projectSnapshot();
        if (!data.image && !this.frames.length) return;
        if (!storage('set', JSON.stringify(data)) && data.image && data.image.src) {
            // Probably over quota: keep the frames, drop the pixels.
            data.image.src = null;
            storage('set', JSON.stringify(data));
        }
    }

    // ------------------------------------------------------------------
    // Background and masks

    effectiveBackground() {
        if (!this.imageData) return null;
        const mode = $('sg-bg-mode').value;
        if (mode === 'alpha') return null;
        if (mode === 'colour') return hexToRgb($('sg-bg-colour').value);
        return guessBackground(this.imageData);
    }

    getMask() {
        const colour = this.effectiveBackground();
        const tol = clamp(int($('sg-bg-tol').value, 8), 0, 255);
        const key = `${colour ? rgbToHex(colour) : 'alpha'}|${tol}`;
        if (!this.maskCache || this.maskCache.key !== key) {
            this.maskCache = { key, colour, mask: buildSolidMask(this.imageData, colour, tol) };
        }
        return this.maskCache;
    }

    updateBackgroundUI() {
        const mode = $('sg-bg-mode').value;
        $('sg-bg-colour').closest('.sg-row').dataset.disabled = String(mode !== 'colour');
        const status = $('sg-bg-status');
        const colour = this.effectiveBackground();
        if (!this.imageData) {
            status.textContent = '';
        } else if (colour) {
            const hex = rgbToHex(colour);
            if (mode === 'auto') $('sg-bg-colour').value = hex;
            status.innerHTML = `<span class="sg-swatch" style="background:${hex}"></span>Background ${hex} (plus fully transparent pixels)`;
        } else {
            status.textContent = mode === 'auto' ? 'Background: transparent pixels' : 'Background: transparent pixels only';
        }
        $('sg-transparent-row').hidden = !colour;
    }

    // ------------------------------------------------------------------
    // Frame detection

    runAutoDetect({ quiet = false, keepAnimations = true } = {}) {
        if (!this.imageData) return;
        const { colour } = this.getMask();
        const rects = autoDetect(this.imageData, {
            colour,
            tolerance: clamp(int($('sg-bg-tol').value, 8), 0, 255),
            gap: clamp(int($('sg-gap').value, 1), 0, 256),
            minPixels: Math.max(1, int($('sg-min').value, 6)),
        });
        this.replaceFrames(rects, keepAnimations);
        if (!quiet) {
            this.toast(rects.length
                ? `Found ${rects.length} frames.`
                : 'No frames found. Check the background setting, or try the Grid tab.', !rects.length);
        }
    }

    gridOptions() {
        return {
            cellW: int($('sg-g-w').value, 32),
            cellH: int($('sg-g-h').value, 32),
            offX: int($('sg-g-ox').value),
            offY: int($('sg-g-oy').value),
            spaceX: int($('sg-g-sx').value),
            spaceY: int($('sg-g-sy').value),
            cols: int($('sg-g-cols').value),
            rows: int($('sg-g-rows').value),
        };
    }

    updateGridStatus() {
        if (!this.source) return;
        const cells = gridSlice(this.source.width, this.source.height, this.gridOptions());
        const o = this.gridOptions();
        $('sg-grid-status').textContent = cells.length
            ? `${cells.length} cells of ${o.cellW}×${o.cellH}. The grid is previewed on the sheet.`
            : 'No whole cells fit with these settings.';
        if (this.tab === 'grid') this.requestRender();
    }

    runGridSlice() {
        if (!this.source) return;
        let cells = gridSlice(this.source.width, this.source.height, this.gridOptions());
        const skipEmpty = $('sg-g-skip').checked;
        const trim = $('sg-g-trim').checked;
        if (skipEmpty || trim) {
            const { mask } = this.getMask();
            cells = cells
                .map((c) => {
                    const t = trimRect(mask, this.source.width, c);
                    if (!t) return skipEmpty ? null : c;
                    return trim ? t : c;
                })
                .filter(Boolean);
        }
        this.replaceFrames(cells, true);
        this.toast(`Sliced ${cells.length} frames.`);
    }

    // Swap in a new set of frames. Animation frames follow the new frame that
    // best overlaps their old rectangle, so re-detecting doesn't lose work.
    replaceFrames(rects, keepAnimations) {
        this.pushUndo();
        const old = new Map(this.frames.map((f) => [f.id, f]));
        this.frames = [];
        rects.forEach((r) => this.frames.push(this.makeFrame(r)));
        this.selection.clear();
        if (keepAnimations) {
            for (const anim of this.animations) {
                anim.frames = anim.frames
                    .map((af) => {
                        const prev = old.get(af.frameId);
                        if (!prev) return null;
                        let best = null;
                        let bestScore = 0.5;
                        for (const f of this.frames) {
                            const score = overlapScore(prev, f);
                            if (score > bestScore) {
                                best = f;
                                bestScore = score;
                            }
                        }
                        return best ? { ...af, frameId: best.id } : null;
                    })
                    .filter(Boolean);
            }
        } else {
            this.animations = [];
            this.currentAnimId = null;
        }
        this.resetPreview();
        this.commit({ frames: true, anims: true });
    }

    // ------------------------------------------------------------------
    // Frames

    makeFrame(rect, name) {
        const id = this.nextId++;
        const frame = { id, name: '', x: rect.x, y: rect.y, w: rect.w, h: rect.h };
        frame.name = this.uniqueName(name || `frame_${String(this.frames.length).padStart(3, '0')}`, frame);
        return frame;
    }

    uniqueName(base, self = null) {
        const clean = String(base).trim() || 'frame';
        const taken = new Set(this.frames.filter((f) => f !== self).map((f) => f.name));
        if (!taken.has(clean)) return clean;
        let i = 2;
        while (taken.has(`${clean}_${i}`)) i++;
        return `${clean}_${i}`;
    }

    frameById(id) {
        return this.frames.find((f) => f.id === id);
    }

    selectedFrames() {
        return this.frames.filter((f) => this.selection.has(f.id));
    }

    selectAll() {
        this.selection = new Set(this.frames.map((f) => f.id));
        this.commit({ save: false });
    }

    deleteSelection() {
        if (!this.selection.size) return;
        this.pushUndo();
        const n = this.selection.size;
        this.frames = this.frames.filter((f) => !this.selection.has(f.id));
        for (const anim of this.animations) {
            anim.frames = anim.frames.filter((af) => !this.selection.has(af.frameId));
        }
        this.selection.clear();
        this.resetPreview();
        this.commit({ frames: true, anims: true });
        this.toast(`Deleted ${n} frame${n === 1 ? '' : 's'}.`);
    }

    trimSelection() {
        const sel = this.selectedFrames();
        if (!sel.length || !this.imageData) return;
        const { mask } = this.getMask();
        this.pushUndo();
        let changed = 0;
        for (const f of sel) {
            const t = trimRect(mask, this.source.width, f);
            if (t && (t.x !== f.x || t.y !== f.y || t.w !== f.w || t.h !== f.h)) {
                Object.assign(f, t);
                changed++;
            }
        }
        if (!changed) this.undoStack.pop();
        this.commit({ frames: true });
        this.toast(changed ? `Trimmed ${changed} frame${changed === 1 ? '' : 's'}.` : 'Already tight.');
    }

    clearFrames() {
        if (!this.frames.length) return;
        this.pushUndo();
        this.frames = [];
        this.selection.clear();
        this.animations.forEach((a) => { a.frames = []; });
        this.resetPreview();
        this.commit({ frames: true, anims: true });
        this.toast('Cleared all frames. Ctrl+Z brings them back.');
    }

    renameAll() {
        if (!this.frames.length) return;
        const prefix = window.prompt('Rename all frames to prefix_000, prefix_001… Prefix:', $('sg-sheet-name').value || 'frame');
        if (prefix === null) return;
        const clean = safeFileName(prefix, 'frame');
        this.pushUndo();
        const digits = Math.max(3, String(this.frames.length - 1).length);
        this.frames.forEach((f, i) => { f.name = `${clean}_${String(i).padStart(digits, '0')}`; });
        this.commit({ frames: true });
    }

    renameSelected(value) {
        const [f] = this.selectedFrames();
        if (!f) return;
        const name = String(value).trim();
        if (!name || name === f.name) {
            $('sg-f-name').value = f.name;
            return;
        }
        this.pushUndo();
        f.name = this.uniqueName(name, f);
        if (f.name !== name) this.toast(`"${name}" is taken, so it's called ${f.name}.`);
        this.commit({ frames: true });
    }

    setSelectedRect(key, value) {
        const [f] = this.selectedFrames();
        if (!f) return;
        const W = this.source.width;
        const H = this.source.height;
        this.pushUndo();
        if (key === 'x') f.x = clamp(value, 0, W - f.w);
        if (key === 'y') f.y = clamp(value, 0, H - f.h);
        if (key === 'w') f.w = clamp(value, 1, W - f.x);
        if (key === 'h') f.h = clamp(value, 1, H - f.y);
        this.commit({ frames: true });
    }

    nudge(dx, dy, resize) {
        const sel = this.selectedFrames();
        if (!sel.length) return;
        this.pushUndo('nudge');
        const W = this.source.width;
        const H = this.source.height;
        for (const f of sel) {
            if (resize) {
                f.w = clamp(f.w + dx, 1, W - f.x);
                f.h = clamp(f.h + dy, 1, H - f.y);
            } else {
                f.x = clamp(f.x + dx, 0, W - f.w);
                f.y = clamp(f.y + dy, 0, H - f.h);
            }
        }
        this.commit({ frames: true });
    }

    // ------------------------------------------------------------------
    // Undo

    pushUndo(tag = null) {
        const now = Date.now();
        if (tag && tag === this.lastUndoTag && now - this.lastUndoAt < 1000) {
            this.lastUndoAt = now;
            return;
        }
        this.lastUndoTag = tag;
        this.lastUndoAt = now;
        this.undoStack.push(JSON.stringify(this.projectSnapshot(false)));
        if (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
        this.redoStack = [];
    }

    undo() {
        if (!this.undoStack.length) return;
        this.redoStack.push(JSON.stringify(this.projectSnapshot(false)));
        this.restoreSnapshot(this.undoStack.pop());
    }

    redo() {
        if (!this.redoStack.length) return;
        this.undoStack.push(JSON.stringify(this.projectSnapshot(false)));
        this.restoreSnapshot(this.redoStack.pop());
    }

    restoreSnapshot(json) {
        const s = JSON.parse(json);
        this.frames = s.frames;
        this.animations = s.animations;
        this.currentAnimId = s.currentAnimId;
        this.nextId = s.nextId;
        const ids = new Set(this.frames.map((f) => f.id));
        this.selection = new Set([...this.selection].filter((id) => ids.has(id)));
        this.lastUndoTag = null;
        this.resetPreview();
        this.commit({ frames: true, anims: true });
    }

    // ------------------------------------------------------------------
    // Animations

    currentAnim() {
        return this.animations.find((a) => a.id === this.currentAnimId) || null;
    }

    createAnimation(name) {
        const taken = new Set(this.animations.map((a) => a.name));
        let base = String(name || '').trim() || 'anim';
        let candidate = base;
        let i = 2;
        if (!name) {
            i = 1;
            candidate = `${base}_${i}`;
        }
        while (taken.has(candidate)) candidate = `${base}_${i++}`;
        const anim = { id: this.nextId++, name: candidate, fps: 10, loop: 'loop', flipX: false, frames: [] };
        this.animations.push(anim);
        this.currentAnimId = anim.id;
        return anim;
    }

    newAnimation() {
        this.pushUndo();
        this.createAnimation();
        this.resetPreview();
        this.commit({ anims: true });
        $('sg-anim-name').focus();
        $('sg-anim-name').select();
    }

    deleteAnimation() {
        const anim = this.currentAnim();
        if (!anim) return;
        this.pushUndo();
        const idx = this.animations.indexOf(anim);
        this.animations.splice(idx, 1);
        const next = this.animations[Math.min(idx, this.animations.length - 1)];
        this.currentAnimId = next ? next.id : null;
        this.resetPreview();
        this.commit({ anims: true });
    }

    renameAnimation(value) {
        const anim = this.currentAnim();
        if (!anim) return;
        const name = String(value).trim();
        if (!name || this.animations.some((a) => a !== anim && a.name === name)) {
            $('sg-anim-name').value = anim.name;
            if (name) this.toast(`There is already an animation called ${name}.`, true);
            return;
        }
        this.pushUndo();
        anim.name = name;
        this.commit({ anims: true });
    }

    updateAnim(props) {
        const anim = this.currentAnim();
        if (!anim) return;
        this.pushUndo();
        Object.assign(anim, props);
        this.commit({ anims: true });
    }

    addSelectionToAnimation() {
        this.addToAnimation(this.selectedFrames().map((f) => f.id));
    }

    addToAnimation(ids) {
        if (!ids.length) {
            this.toast('Select one or more frames on the sheet first.');
            return;
        }
        this.pushUndo();
        const anim = this.currentAnim() || this.createAnimation();
        ids.forEach((frameId) => anim.frames.push({ frameId, duration: 0 }));
        this.commit({ anims: true });
        if (!this.preview.playing && anim.frames.length > 1) this.play();
    }

    animationsFromRows() {
        if (!this.frames.length) return;
        const rows = groupRows(this.frames);
        this.pushUndo();
        rows.forEach((row, i) => {
            const anim = this.createAnimation(`row_${i + 1}`);
            anim.frames = row.map((f) => ({ frameId: f.id, duration: 0 }));
        });
        this.currentAnimId = this.animations[this.animations.length - rows.length].id;
        this.resetPreview();
        this.commit({ anims: true });
        this.toast(`Made ${rows.length} animations, one per row.`);
    }

    moveAnimFrame(from, to) {
        const anim = this.currentAnim();
        if (!anim || from === to || from < 0 || to < 0 || from >= anim.frames.length || to > anim.frames.length) return;
        this.pushUndo();
        const [item] = anim.frames.splice(from, 1);
        anim.frames.splice(to > from ? to - 1 : to, 0, item);
        this.commit({ anims: true });
    }

    onStripDragOver(e) {
        if (this.stripDragIndex === null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.clearDropMarks();
        const thumb = e.target.closest('.sg-thumb');
        if (!thumb) return;
        const r = thumb.getBoundingClientRect();
        thumb.classList.add(e.clientX < r.left + r.width / 2 ? 'drop-before' : 'drop-after');
    }

    onStripDrop(e) {
        if (this.stripDragIndex === null) return;
        e.preventDefault();
        const thumb = e.target.closest('.sg-thumb');
        const anim = this.currentAnim();
        let to = anim ? anim.frames.length : 0;
        if (thumb) {
            const r = thumb.getBoundingClientRect();
            to = int(thumb.dataset.index) + (e.clientX < r.left + r.width / 2 ? 0 : 1);
        }
        const from = this.stripDragIndex;
        this.stripDragIndex = null;
        this.clearDropMarks();
        this.moveAnimFrame(from, to);
    }

    clearDropMarks() {
        $('sg-strip').querySelectorAll('.drop-before, .drop-after').forEach((el) => el.classList.remove('drop-before', 'drop-after'));
    }

    // ------------------------------------------------------------------
    // Rendering the UI

    // After any change: redraw what depends on it and autosave.
    commit({ frames = false, anims = false, save = true } = {}) {
        this.requestRender();
        this.refreshInspector();
        if (anims || frames) this.refreshAnimations();
        this.refreshControls();
        if (save) this.scheduleSave();
    }

    refreshAll() {
        this.commit({ frames: true, anims: true, save: false });
    }

    refreshControls() {
        const hasImage = !!this.source;
        const hasFrames = this.frames.length > 0;
        const anim = this.currentAnim();
        $('sg-detect').disabled = !hasImage;
        $('sg-slice').disabled = !hasImage;
        $('sg-select-all').disabled = !hasFrames;
        $('sg-rename-all').disabled = !hasFrames;
        $('sg-clear').disabled = !hasFrames;
        $('sg-anim-from-rows').disabled = !hasFrames;
        $('sg-anim-clear').disabled = !(anim && anim.frames.length);
        $('sg-anim-delete').disabled = !anim;
        $('sg-exp-atlas').disabled = !hasFrames;
        $('sg-exp-png').disabled = !hasFrames;
        $('sg-exp-json').disabled = !hasFrames;
        $('sg-exp-legacy').disabled = !hasFrames;
        $('sg-exp-strip').disabled = !(anim && anim.frames.length);
        $('sg-undo').disabled = !this.undoStack.length;
        $('sg-redo').disabled = !this.redoStack.length;
        $('sg-status-image').textContent = hasImage ? `${this.imageName} · ${this.source.width}×${this.source.height}` : 'No image';
        $('sg-status-frames').textContent = hasImage
            ? `${this.frames.length} frame${this.frames.length === 1 ? '' : 's'}${this.selection.size ? ` · ${this.selection.size} selected` : ''}`
            : '';
    }

    refreshInspector() {
        const sel = this.selectedFrames();
        $('sg-sel-count').textContent = sel.length ? `(${sel.length})` : '';
        $('sg-inspector-empty').hidden = sel.length > 0;
        $('sg-inspector-single').hidden = sel.length !== 1;
        $('sg-inspector-actions').hidden = sel.length === 0;
        if (sel.length === 1) {
            const f = sel[0];
            const active = document.activeElement;
            const set = (id, v) => {
                if ($(id) !== active) $(id).value = v;
            };
            set('sg-f-name', f.name);
            set('sg-f-x', f.x);
            set('sg-f-y', f.y);
            set('sg-f-w', f.w);
            set('sg-f-h', f.h);
        }
    }

    refreshAnimations() {
        const select = $('sg-anim-select');
        const anim = this.currentAnim();
        select.innerHTML = '';
        if (!this.animations.length) {
            const opt = new Option('No animations yet', '');
            select.add(opt);
            select.disabled = true;
        } else {
            select.disabled = false;
            for (const a of this.animations) {
                select.add(new Option(`${a.name} (${a.frames.length})`, String(a.id), false, a === anim));
            }
        }
        $('sg-anim-props').hidden = !anim;
        if (anim) {
            if (document.activeElement !== $('sg-anim-name')) $('sg-anim-name').value = anim.name;
            $('sg-anim-fps').value = anim.fps;
            $('sg-anim-loop').value = anim.loop;
            $('sg-anim-flip').checked = !!anim.flipX;
        }
        this.renderStrip();
        if (this.preview.pos >= this.sequence().length) this.preview.pos = 0;
        this.renderPreview();
    }

    renderStrip() {
        const strip = $('sg-strip');
        const anim = this.currentAnim();
        strip.innerHTML = '';
        $('sg-strip-hint').hidden = !!(anim && anim.frames.length > 1);
        if (!anim || !this.source) return;
        const current = this.currentPreviewIndex();
        anim.frames.forEach((af, i) => {
            const f = this.frameById(af.frameId);
            if (!f) return;
            const thumb = document.createElement('div');
            thumb.className = 'sg-thumb' + (i === current ? ' is-current' : '');
            thumb.draggable = true;
            thumb.tabIndex = 0;
            thumb.dataset.index = String(i);
            thumb.title = `${f.name} (${f.w}×${f.h}). Drag to reorder; Alt+←/→ moves; Del removes.`;

            const c = document.createElement('canvas');
            const size = 44;
            const dpr = window.devicePixelRatio || 1;
            c.width = size * dpr;
            c.height = size * dpr;
            const cx = c.getContext('2d');
            cx.imageSmoothingEnabled = false;
            const s = Math.min(size / f.w, size / f.h) * dpr;
            const dw = f.w * s;
            const dh = f.h * s;
            cx.drawImage(this.source, f.x, f.y, f.w, f.h, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh);

            const label = document.createElement('span');
            label.className = 'sg-thumb-index';
            label.textContent = String(i + 1);

            const dur = document.createElement('input');
            dur.type = 'number';
            dur.min = '0';
            dur.step = '10';
            dur.value = af.duration > 0 ? String(af.duration) : '';
            dur.placeholder = String(frameDuration(af, anim));
            dur.title = 'Duration in ms (blank = use FPS)';
            dur.setAttribute('aria-label', `Frame ${i + 1} duration in milliseconds`);
            dur.addEventListener('change', () => {
                this.pushUndo();
                af.duration = Math.max(0, int(dur.value));
                this.commit({ anims: true });
            });
            dur.addEventListener('pointerdown', (e) => e.stopPropagation());

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'sg-thumb-remove';
            remove.textContent = '×';
            remove.setAttribute('aria-label', `Remove frame ${i + 1} from animation`);
            remove.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeAnimFrame(i);
            });

            thumb.addEventListener('click', (e) => {
                if (e.target === dur) return;
                this.pause();
                this.preview.pos = this.sequence().indexOf(i);
                this.selection = new Set([f.id]);
                this.scrollFrameIntoView(f);
                this.commit({ anims: true, save: false });
            });
            thumb.addEventListener('keydown', (e) => {
                if (e.target === dur) return;
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.removeAnimFrame(i);
                } else if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const to = e.key === 'ArrowLeft' ? i - 1 : i + 2;
                    this.moveAnimFrame(i, clamp(to, 0, anim.frames.length));
                    const moved = strip.querySelector(`[data-index="${clamp(e.key === 'ArrowLeft' ? i - 1 : i + 1, 0, anim.frames.length - 1)}"]`);
                    if (moved) moved.focus();
                }
            });
            thumb.addEventListener('dragstart', (e) => {
                this.stripDragIndex = i;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(i));
                thumb.classList.add('is-dragging');
            });
            thumb.addEventListener('dragend', () => {
                this.stripDragIndex = null;
                thumb.classList.remove('is-dragging');
                this.clearDropMarks();
            });

            thumb.append(c, label, dur, remove);
            strip.appendChild(thumb);
        });
    }

    removeAnimFrame(index) {
        const anim = this.currentAnim();
        if (!anim) return;
        this.pushUndo();
        anim.frames.splice(index, 1);
        this.commit({ anims: true });
    }

    // ------------------------------------------------------------------
    // Sheet canvas

    setTab(tab) {
        this.tab = tab;
        this.root.querySelectorAll('.sg-tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === tab)));
        this.root.querySelectorAll('.sg-tabpanel').forEach((p) => { p.hidden = p.dataset.panel !== tab; });
        this.updateGridStatus();
        this.requestRender();
    }

    setTool(tool) {
        if (tool === 'pick' && this.tool !== 'pick') this.toolBeforePick = this.tool;
        this.tool = tool;
        this.canvas.dataset.tool = tool;
        this.root.querySelectorAll('[data-tool]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === tool)));
        $('sg-bg-pick').setAttribute('aria-pressed', String(tool === 'pick'));
        if (tool === 'pick') this.toast('Click a background pixel on the sheet.');
        this.canvas.style.cursor = '';
    }

    zoomToFit() {
        if (!this.source) return;
        const pad = 48;
        const w = Math.max(50, this.wrap.clientWidth - pad);
        const h = Math.max(50, this.wrap.clientHeight - pad);
        let z = Math.min(w / this.source.width, h / this.source.height);
        z = z >= 1 ? Math.floor(z * 2) / 2 : z;
        this.setZoom(clamp(z, ZOOM_STEPS[0], ZOOM_STEPS[ZOOM_STEPS.length - 1]));
    }

    stepZoom(dir) {
        const z = this.zoom;
        const next = dir > 0 ? ZOOM_STEPS.find((s) => s > z + 1e-6) : [...ZOOM_STEPS].reverse().find((s) => s < z - 1e-6);
        if (next) this.setZoom(next);
    }

    // Zoom keeping the image point under (clientX, clientY) in place.
    setZoom(z, clientX, clientY) {
        if (!this.source) return;
        z = clamp(z, ZOOM_STEPS[0], ZOOM_STEPS[ZOOM_STEPS.length - 1]);
        const wrapRect = this.wrap.getBoundingClientRect();
        if (clientX === undefined) {
            clientX = wrapRect.left + this.wrap.clientWidth / 2;
            clientY = wrapRect.top + this.wrap.clientHeight / 2;
        }
        const before = this.canvas.getBoundingClientRect();
        const ix = (clientX - before.left) / this.zoom;
        const iy = (clientY - before.top) / this.zoom;
        this.zoom = z;
        this.layoutCanvas();
        const after = this.canvas.getBoundingClientRect();
        this.wrap.scrollLeft += after.left + ix * z - clientX;
        this.wrap.scrollTop += after.top + iy * z - clientY;
        $('sg-zoom-label').textContent = `${Math.round(z * 100)}%`;
    }

    layoutCanvas() {
        const W = this.source.width;
        const H = this.source.height;
        const dpr = window.devicePixelRatio || 1;
        let s = this.zoom * dpr;
        s = Math.min(s, 8192 / W, 8192 / H);
        if (W * H * s * s > 4e7) s = Math.sqrt(4e7 / (W * H));
        this.backingScale = s;
        this.canvas.width = Math.max(1, Math.round(W * s));
        this.canvas.height = Math.max(1, Math.round(H * s));
        this.canvas.style.width = `${W * this.zoom}px`;
        this.canvas.style.height = `${H * this.zoom}px`;
        this.render();
    }

    requestRender() {
        if (this.renderQueued) return;
        this.renderQueued = true;
        requestAnimationFrame(() => {
            this.renderQueued = false;
            this.render();
        });
    }

    render() {
        const ctx = this.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.source) return;
        const s = this.backingScale;
        const z = this.zoom;
        const px = 1 / z; // one CSS pixel in image units
        ctx.setTransform(s, 0, 0, s, 0, 0);
        ctx.imageSmoothingEnabled = z < 1;
        ctx.drawImage(this.source, 0, 0);

        if (this.tab === 'grid') {
            ctx.save();
            ctx.strokeStyle = 'rgba(255,255,255,0.45)';
            ctx.lineWidth = px;
            ctx.setLineDash([4 * px, 3 * px]);
            for (const c of gridSlice(this.source.width, this.source.height, this.gridOptions())) {
                ctx.strokeRect(c.x + px / 2, c.y + px / 2, c.w - px, c.h - px);
            }
            ctx.restore();
        }

        const anim = this.currentAnim();
        const inAnim = new Set(anim ? anim.frames.map((af) => af.frameId) : []);
        const showLabels = $('sg-labels').checked;
        ctx.font = `${9 * px}px "Roboto Mono", monospace`;
        ctx.textBaseline = 'top';
        this.frames.forEach((f, i) => {
            const selected = this.selection.has(f.id);
            const colour = selected ? this.colours.selected : inAnim.has(f.id) ? this.colours.inAnim : this.colours.frame;
            if (selected) {
                ctx.fillStyle = 'rgba(255, 89, 125, 0.16)';
                ctx.fillRect(f.x, f.y, f.w, f.h);
            }
            ctx.strokeStyle = colour;
            ctx.lineWidth = (selected ? 2 : 1) * px;
            const inset = ctx.lineWidth / 2;
            ctx.strokeRect(f.x + inset, f.y + inset, Math.max(0, f.w - inset * 2), Math.max(0, f.h - inset * 2));
            // Numbers only where they won't hide the sprite; zoom in to see more.
            if (showLabels && f.w * z >= 30 && f.h * z >= 24) {
                const label = String(i + 1);
                const tw = ctx.measureText(label).width + 4 * px;
                ctx.globalAlpha = 0.85;
                ctx.fillStyle = colour;
                ctx.fillRect(f.x, f.y, tw, 11 * px);
                ctx.globalAlpha = 1;
                ctx.fillStyle = this.colours.dark;
                ctx.fillText(label, f.x + 2 * px, f.y + 1.5 * px);
            }
        });

        const sel = this.selectedFrames();
        if (sel.length === 1 && this.tool === 'select') {
            const hs = 7 * px;
            ctx.fillStyle = this.colours.text;
            ctx.strokeStyle = this.colours.dark;
            ctx.lineWidth = px;
            for (const h of HANDLES) {
                const p = this.handlePoint(sel[0], h);
                ctx.fillRect(p.x - hs / 2, p.y - hs / 2, hs, hs);
                ctx.strokeRect(p.x - hs / 2, p.y - hs / 2, hs, hs);
            }
        }

        if (this.drag && (this.drag.type === 'marquee' || this.drag.type === 'draw')) {
            const r = this.dragRect();
            ctx.save();
            ctx.strokeStyle = this.drag.type === 'draw' ? this.colours.frame : this.colours.text;
            ctx.lineWidth = px;
            ctx.setLineDash([4 * px, 3 * px]);
            ctx.strokeRect(r.x, r.y, r.w, r.h);
            ctx.restore();
            if (this.drag.type === 'draw') this.setCursorStatus(`${r.w}×${r.h} at ${r.x}, ${r.y}`);
        }
    }

    handlePoint(f, h) {
        const x = h.includes('w') ? f.x : h.includes('e') ? f.x + f.w : f.x + f.w / 2;
        const y = h.includes('n') ? f.y : h.includes('s') ? f.y + f.h : f.y + f.h / 2;
        return { x, y };
    }

    handleAt(p) {
        const sel = this.selectedFrames();
        if (sel.length !== 1) return null;
        const r = 6 / this.zoom;
        return HANDLES.find((h) => {
            const hp = this.handlePoint(sel[0], h);
            return Math.abs(p.x - hp.x) <= r && Math.abs(p.y - hp.y) <= r;
        }) || null;
    }

    // Smallest frame under the point, so nested/overlapping frames are reachable.
    frameAt(p) {
        let best = null;
        for (const f of this.frames) {
            if (p.x >= f.x && p.x < f.x + f.w && p.y >= f.y && p.y < f.y + f.h) {
                if (!best || f.w * f.h < best.w * best.h) best = f;
            }
        }
        return best;
    }

    toImage(e) {
        const r = this.canvas.getBoundingClientRect();
        return { x: (e.clientX - r.left) / this.zoom, y: (e.clientY - r.top) / this.zoom };
    }

    dragRect(drag = this.drag) {
        const { start, cur } = drag;
        const W = this.source.width;
        const H = this.source.height;
        const x0 = clamp(Math.floor(Math.min(start.x, cur.x)), 0, W);
        const y0 = clamp(Math.floor(Math.min(start.y, cur.y)), 0, H);
        const x1 = clamp(Math.ceil(Math.max(start.x, cur.x)), 0, W);
        const y1 = clamp(Math.ceil(Math.max(start.y, cur.y)), 0, H);
        return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }

    scrollFrameIntoView(f) {
        const cr = this.canvas.getBoundingClientRect();
        const wr = this.wrap.getBoundingClientRect();
        const left = cr.left + f.x * this.zoom;
        const top = cr.top + f.y * this.zoom;
        const right = left + f.w * this.zoom;
        const bottom = top + f.h * this.zoom;
        if (left < wr.left || right > wr.right) this.wrap.scrollLeft += left - wr.left - wr.width / 2 + (right - left) / 2;
        if (top < wr.top || bottom > wr.bottom) this.wrap.scrollTop += top - wr.top - wr.height / 2 + (bottom - top) / 2;
    }

    setCursorStatus(text) {
        $('sg-status-cursor').innerHTML = text;
    }

    onPointerDown(e) {
        if (!this.source || e.button !== 0) return;
        const p = this.toImage(e);
        if (this.tool === 'pick') {
            this.pickBackground(p);
            return;
        }
        if (e.pointerType !== 'touch' || this.tool === 'draw') this.canvas.setPointerCapture(e.pointerId);
        if (this.tool === 'draw') {
            this.drag = { type: 'draw', start: p, cur: p };
            return;
        }
        const handle = this.handleAt(p);
        if (handle) {
            const f = this.selectedFrames()[0];
            this.drag = { type: 'resize', handle, frame: f, orig: { ...f }, start: p, changed: false };
            return;
        }
        const hit = this.frameAt(p);
        if (hit) {
            if (e.shiftKey || e.ctrlKey || e.metaKey) {
                if (this.selection.has(hit.id)) this.selection.delete(hit.id);
                else this.selection.add(hit.id);
                this.commit({ save: false });
                return;
            }
            if (!this.selection.has(hit.id)) this.selection = new Set([hit.id]);
            const origs = new Map(this.selectedFrames().map((f) => [f.id, { x: f.x, y: f.y }]));
            this.drag = { type: 'move', start: p, origs, changed: false };
            this.commit({ save: false });
            return;
        }
        const additive = e.shiftKey || e.ctrlKey || e.metaKey;
        this.drag = { type: 'marquee', start: p, cur: p, base: additive ? new Set(this.selection) : new Set() };
        if (!additive) {
            this.selection.clear();
            this.commit({ save: false });
        }
    }

    onPointerMove(e) {
        if (!this.source) return;
        const p = this.toImage(e);
        this.showPixelStatus(p);
        const d = this.drag;
        if (!d) {
            if (this.tool === 'select') {
                const handle = this.handleAt(p);
                this.canvas.style.cursor = handle ? HANDLE_CURSORS[handle] : this.frameAt(p) ? 'move' : 'default';
            }
            return;
        }
        const W = this.source.width;
        const H = this.source.height;
        if (d.type === 'move') {
            const dx = Math.round(p.x - d.start.x);
            const dy = Math.round(p.y - d.start.y);
            if (!d.changed && (dx || dy)) {
                this.pushUndo();
                d.changed = true;
            }
            for (const f of this.selectedFrames()) {
                const o = d.origs.get(f.id);
                if (!o) continue;
                f.x = clamp(o.x + dx, 0, W - f.w);
                f.y = clamp(o.y + dy, 0, H - f.h);
            }
            this.refreshInspector();
        } else if (d.type === 'resize') {
            const o = d.orig;
            const dx = Math.round(p.x - d.start.x);
            const dy = Math.round(p.y - d.start.y);
            let x0 = o.x, y0 = o.y, x1 = o.x + o.w, y1 = o.y + o.h;
            if (d.handle.includes('w')) x0 = clamp(o.x + dx, 0, x1 - 1);
            if (d.handle.includes('e')) x1 = clamp(o.x + o.w + dx, x0 + 1, W);
            if (d.handle.includes('n')) y0 = clamp(o.y + dy, 0, y1 - 1);
            if (d.handle.includes('s')) y1 = clamp(o.y + o.h + dy, y0 + 1, H);
            if (!d.changed && (x0 !== o.x || y0 !== o.y || x1 !== o.x + o.w || y1 !== o.y + o.h)) {
                this.pushUndo();
                d.changed = true;
            }
            Object.assign(d.frame, { x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
            this.refreshInspector();
        } else if (d.type === 'marquee') {
            d.cur = p;
            const r = this.dragRect();
            this.selection = new Set(d.base);
            for (const f of this.frames) {
                if (f.x < r.x + r.w && f.x + f.w > r.x && f.y < r.y + r.h && f.y + f.h > r.y) this.selection.add(f.id);
            }
            this.refreshInspector();
            this.refreshControls();
        } else if (d.type === 'draw') {
            d.cur = p;
        }
        this.requestRender();
    }

    onPointerUp(e) {
        const d = this.drag;
        if (!d) return;
        this.drag = null;
        if (d.type === 'draw') {
            this.setCursorStatus('');
            d.cur = this.toImage(e);
            const r = this.dragRect(d);
            if (r.w >= 2 && r.h >= 2) {
                this.pushUndo();
                const f = this.makeFrame(r);
                this.frames.push(f);
                this.selection = new Set([f.id]);
                this.commit({ frames: true });
            } else {
                const hit = this.frameAt(this.toImage(e));
                this.selection = new Set(hit ? [hit.id] : []);
                this.commit({ save: false });
            }
            return;
        }
        if ((d.type === 'move' || d.type === 'resize') && d.changed) {
            this.commit({ frames: true });
            return;
        }
        this.commit({ save: false });
    }

    cancelDrag() {
        const d = this.drag;
        this.drag = null;
        if (d && (d.type === 'move' || d.type === 'resize') && d.changed) this.undo();
        else this.requestRender();
    }

    showPixelStatus(p) {
        const x = Math.floor(p.x);
        const y = Math.floor(p.y);
        if (x < 0 || y < 0 || x >= this.source.width || y >= this.source.height) {
            this.setCursorStatus('');
            return;
        }
        if (this.drag && this.drag.type === 'draw') return;
        const i = (y * this.source.width + x) * 4;
        const d = this.imageData.data;
        const hex = rgbToHex({ r: d[i], g: d[i + 1], b: d[i + 2] });
        const alpha = d[i + 3] === 255 ? '' : ` α${d[i + 3]}`;
        this.setCursorStatus(`${x}, ${y} <span class="sg-swatch" style="background:${d[i + 3] ? hex : 'transparent'}"></span>${hex}${alpha}`);
    }

    pickBackground(p) {
        const x = Math.floor(p.x);
        const y = Math.floor(p.y);
        if (x < 0 || y < 0 || x >= this.source.width || y >= this.source.height) return;
        const i = (y * this.source.width + x) * 4;
        const d = this.imageData.data;
        if (d[i + 3] === 0) {
            $('sg-bg-mode').value = 'alpha';
            this.toast('That pixel is transparent, so transparent pixels count as background.');
        } else {
            $('sg-bg-mode').value = 'colour';
            $('sg-bg-colour').value = rgbToHex({ r: d[i], g: d[i + 1], b: d[i + 2] });
            this.toast(`Background set to ${$('sg-bg-colour').value}. Press "Detect frames".`);
        }
        this.maskCache = null;
        this.updateBackgroundUI();
        this.setTool(this.toolBeforePick === 'pick' ? 'select' : this.toolBeforePick);
        this.scheduleSave();
    }

    // ------------------------------------------------------------------
    // Keyboard

    onKeyDown(e) {
        const target = e.target;
        const typing = target.closest && target.closest('input, select, textarea, [contenteditable]');
        if (e.key === 'Escape') {
            if (!$('sg-help').hidden) {
                this.toggleHelp(false);
            } else if (this.tool === 'pick') {
                this.setTool(this.toolBeforePick);
            } else if (this.drag) {
                this.cancelDrag();
            } else if (!typing) {
                this.selection.clear();
                this.commit({ save: false });
            }
            return;
        }
        if (typing) return;
        const mod = e.ctrlKey || e.metaKey;
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

        if (mod && key === 'z') {
            e.preventDefault();
            if (e.shiftKey) this.redo();
            else this.undo();
            return;
        }
        if (mod && key === 'y') {
            e.preventDefault();
            this.redo();
            return;
        }
        if (mod && key === 'a') {
            if (!this.frames.length) return;
            e.preventDefault();
            this.selectAll();
            return;
        }
        if (mod || (e.altKey && !key.startsWith('Arrow'))) return;

        const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
        if (arrows[key] && this.selection.size) {
            e.preventDefault();
            const step = e.shiftKey ? 10 : 1;
            this.nudge(arrows[key][0] * step, arrows[key][1] * step, e.altKey);
            return;
        }
        // Buttons and the strip handle their own Space/Enter.
        const onButton = target.closest && target.closest('button, summary, .sg-thumb');
        switch (key) {
            case 'Delete':
            case 'Backspace':
                if (this.selection.size) {
                    e.preventDefault();
                    this.deleteSelection();
                }
                break;
            case ' ':
                if (onButton) return;
                e.preventDefault();
                this.togglePlay();
                break;
            case ',':
            case '<':
                this.stepPreview(-1);
                break;
            case '.':
            case '>':
                this.stepPreview(1);
                break;
            case 'v':
                this.setTool('select');
                break;
            case 'r':
                this.setTool('draw');
                break;
            case 'i':
                if (this.source) this.setTool('pick');
                break;
            case 'a':
                this.addSelectionToAnimation();
                break;
            case 'n':
                this.newAnimation();
                break;
            case 't':
                this.trimSelection();
                break;
            case '+':
            case '=':
                this.stepZoom(1);
                break;
            case '-':
            case '_':
                this.stepZoom(-1);
                break;
            case '0':
                this.zoomToFit();
                break;
            case '?':
                this.toggleHelp();
                break;
            default:
                break;
        }
    }

    toggleHelp(force) {
        const help = $('sg-help');
        const show = force === undefined ? help.hidden : force;
        help.hidden = !show;
        $('sg-help-btn').setAttribute('aria-expanded', String(show));
        if (show) $('sg-help-close').focus();
    }

    // ------------------------------------------------------------------
    // Preview

    previewItems() {
        const anim = this.currentAnim();
        if (!anim) return [];
        return anim.frames
            .map((af) => ({ af, frame: this.frameById(af.frameId) }))
            .filter((it) => it.frame);
    }

    // Order of item indices for one cycle of the current playback mode.
    sequence() {
        const anim = this.currentAnim();
        const n = this.previewItems().length;
        const seq = Array.from({ length: n }, (_, i) => i);
        if (anim && anim.loop === 'pingpong' && n > 2) {
            for (let i = n - 2; i > 0; i--) seq.push(i);
        }
        return seq;
    }

    currentPreviewIndex() {
        const seq = this.sequence();
        return seq.length ? seq[clamp(this.preview.pos, 0, seq.length - 1)] : -1;
    }

    resetPreview() {
        this.preview.pos = 0;
        this.preview.elapsed = 0;
    }

    togglePlay() {
        if (this.preview.playing) this.pause();
        else this.play();
    }

    play() {
        const seq = this.sequence();
        if (seq.length < 1) return;
        const anim = this.currentAnim();
        if (anim.loop === 'once' && this.preview.pos >= seq.length - 1) this.preview.pos = 0;
        this.preview.playing = true;
        this.preview.lastTs = performance.now();
        $('sg-play').textContent = 'Pause';
        cancelAnimationFrame(this.preview.raf);
        this.preview.raf = requestAnimationFrame((ts) => this.tick(ts));
    }

    pause() {
        this.preview.playing = false;
        cancelAnimationFrame(this.preview.raf);
        $('sg-play').textContent = 'Play';
        this.renderPreview();
    }

    stopPreview() {
        this.pause();
        this.resetPreview();
    }

    stepPreview(dir) {
        const seq = this.sequence();
        if (!seq.length) return;
        this.pause();
        this.preview.pos = (this.preview.pos + dir + seq.length) % seq.length;
        this.preview.elapsed = 0;
        this.renderStrip();
        this.renderPreview();
    }

    tick(ts) {
        if (!this.preview.playing) return;
        const anim = this.currentAnim();
        const items = this.previewItems();
        const seq = this.sequence();
        if (!anim || !seq.length) {
            this.pause();
            return;
        }
        const dt = Math.min(250, ts - this.preview.lastTs);
        this.preview.lastTs = ts;
        this.preview.elapsed += dt;
        let changed = false;
        let guard = 0;
        while (guard++ < 100) {
            const item = items[seq[clamp(this.preview.pos, 0, seq.length - 1)]];
            const dur = frameDuration(item.af, anim);
            if (this.preview.elapsed < dur) break;
            this.preview.elapsed -= dur;
            if (anim.loop === 'once' && this.preview.pos >= seq.length - 1) {
                this.pause();
                return;
            }
            this.preview.pos = (this.preview.pos + 1) % seq.length;
            changed = true;
        }
        if (changed) {
            this.renderPreview();
            this.markCurrentThumb();
        }
        this.preview.raf = requestAnimationFrame((t) => this.tick(t));
    }

    markCurrentThumb() {
        const current = this.currentPreviewIndex();
        $('sg-strip').querySelectorAll('.sg-thumb').forEach((t) => {
            t.classList.toggle('is-current', int(t.dataset.index) === current);
        });
    }

    renderPreview() {
        const canvas = this.previewCanvas;
        const ctx = this.previewCtx;
        const dpr = window.devicePixelRatio || 1;
        const cssW = canvas.clientWidth || 280;
        const cssH = canvas.clientHeight || 200;
        if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
            canvas.width = Math.round(cssW * dpr);
            canvas.height = Math.round(cssH * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.paintPreviewBackground(ctx, cssW, cssH);

        const items = this.previewItems();
        const anim = this.currentAnim();
        const info = $('sg-preview-info');
        if (!items.length || !this.source) {
            ctx.fillStyle = 'rgba(128,128,128,0.9)';
            ctx.font = '12px Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(anim ? 'Add frames to preview' : 'No animation selected', cssW / 2, cssH / 2);
            ctx.textAlign = 'start';
            info.textContent = '';
            return;
        }
        const boxW = Math.max(...items.map((it) => it.frame.w));
        const boxH = Math.max(...items.map((it) => it.frame.h));
        const scaleSetting = $('sg-pv-scale').value;
        let scale = scaleSetting === 'auto'
            ? Math.min((cssW - 16) / boxW, (cssH - 16) / boxH)
            : int(scaleSetting, 1);
        if (scaleSetting === 'auto' && scale >= 1) scale = Math.min(8, Math.floor(scale));
        scale = Math.max(scale, 0.05);
        const ox = Math.round((cssW - boxW * scale) / 2);
        const oy = Math.round((cssH - boxH * scale) / 2);
        const anchor = $('sg-anchor').value;
        const index = this.currentPreviewIndex();

        const drawFrame = (f, alpha) => {
            const off = anchorOffset(anchor, boxW, boxH, f.w, f.h);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.imageSmoothingEnabled = false;
            if (anim.flipX) {
                ctx.translate(ox + (boxW - off.x) * scale, oy + off.y * scale);
                ctx.scale(-1, 1);
                ctx.drawImage(this.source, f.x, f.y, f.w, f.h, 0, 0, f.w * scale, f.h * scale);
            } else {
                ctx.drawImage(this.source, f.x, f.y, f.w, f.h, ox + off.x * scale, oy + off.y * scale, f.w * scale, f.h * scale);
            }
            ctx.restore();
        };

        // Frame box and anchor point, faintly.
        ctx.strokeStyle = 'rgba(128,128,128,0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(ox - 0.5, oy - 0.5, boxW * scale + 1, boxH * scale + 1);
        ctx.setLineDash([]);

        if ($('sg-onion').checked && items.length > 1) {
            const prev = items[(index - 1 + items.length) % items.length];
            drawFrame(prev.frame, 0.3);
        }
        const item = items[index];
        drawFrame(item.frame, 1);

        const a = { 'bottom-center': [0.5, 1], center: [0.5, 0.5], 'bottom-left': [0, 1], 'top-left': [0, 0] }[anchor] || [0.5, 1];
        const axp = ox + boxW * scale * a[0];
        const ayp = oy + boxH * scale * a[1];
        ctx.strokeStyle = this.colours.selected;
        ctx.beginPath();
        ctx.moveTo(axp - 5, ayp);
        ctx.lineTo(axp + 5, ayp);
        ctx.moveTo(axp, ayp - 5);
        ctx.lineTo(axp, ayp + 5);
        ctx.stroke();

        const zoomText = scale >= 1 ? `${+scale.toFixed(2)}×` : `${Math.round(scale * 100)}%`;
        info.textContent = `${index + 1}/${items.length} · ${item.frame.name} · ${frameDuration(item.af, anim)}ms · ${zoomText}`;
        info.title = info.textContent;
    }

    paintPreviewBackground(ctx, w, h) {
        const mode = $('sg-pv-bg').value;
        if (mode === 'checker') {
            const size = 8;
            ctx.fillStyle = '#2a2b31';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#383a42';
            for (let y = 0; y < h; y += size) {
                for (let x = ((y / size) % 2) * size; x < w; x += size * 2) {
                    ctx.fillRect(x, y, size, size);
                }
            }
            return;
        }
        ctx.fillStyle = mode === 'dark' ? this.colours.dark : mode === 'light' ? '#f4f1e8' : $('sg-pv-colour').value;
        ctx.fillRect(0, 0, w, h);
    }

    // ------------------------------------------------------------------
    // Export

    exportBaseName() {
        return safeFileName($('sg-sheet-name').value, 'spritesheet');
    }

    // Source pixels for export, with the background colour keyed out if asked.
    exportSource() {
        const { mask, colour } = this.getMask();
        if (!colour || !$('sg-make-transparent').checked) return { canvas: this.source, mask };
        const c = document.createElement('canvas');
        c.width = this.source.width;
        c.height = this.source.height;
        const cx = c.getContext('2d');
        const data = new ImageData(new Uint8ClampedArray(this.imageData.data), c.width, c.height);
        for (let p = 0; p < mask.length; p++) {
            if (!mask[p]) data.data[p * 4 + 3] = 0;
        }
        cx.putImageData(data, 0, 0);
        return { canvas: c, mask };
    }

    exportEntries(mask) {
        const trim = $('sg-trim-export').checked;
        return this.frames.map((f) => {
            const src = { x: f.x, y: f.y, w: f.w, h: f.h };
            let t = trim ? trimRect(mask, this.source.width, src) : null;
            if (trim && !t) t = { x: f.x, y: f.y, w: 1, h: 1 };
            return { name: f.name, src, trim: t || src };
        });
    }

    async exportAtlas({ png, json }) {
        if (!this.frames.length) return;
        try {
            const { canvas: src, mask } = this.exportSource();
            const entries = this.exportEntries(mask);
            const { canvas, placements } = buildAtlas(src, entries, {
                padding: clamp(int($('sg-pad').value, 1), 0, 64),
                powerOfTwo: $('sg-pot').checked,
            });
            const base = this.exportBaseName();
            if (png) download(await canvasToBlob(canvas), `${base}.png`);
            if (json) {
                const data = buildHashJSON({
                    entries,
                    placements,
                    atlasSize: { w: canvas.width, h: canvas.height },
                    imageName: `${base}.png`,
                    source: { image: this.imageName, w: this.source.width, h: this.source.height },
                    animations: this.animations,
                    frames: this.frames,
                    anchor: $('sg-anchor').value,
                });
                download(JSON.stringify(data, null, 2), `${base}.json`);
            }
            this.lastExport = { width: canvas.width, height: canvas.height };
            const what = png && json ? `${base}.png + ${base}.json` : png ? `${base}.png` : `${base}.json`;
            this.toast(`Exported ${what}: ${entries.length} frames on a ${canvas.width}×${canvas.height} atlas.`);
        } catch (err) {
            this.toast(`Export failed: ${err.message}`, true);
        }
    }

    async exportStrip() {
        const anim = this.currentAnim();
        const items = this.previewItems();
        if (!anim || !items.length) return;
        try {
            const { canvas: src } = this.exportSource();
            const { canvas, cellW, cellH } = buildStrip(src, items.map((it) => it.frame), {
                anchor: $('sg-anchor').value,
                flipX: anim.flipX,
            });
            const name = `${this.exportBaseName()}_${safeFileName(anim.name, 'anim')}_strip.png`;
            download(await canvasToBlob(canvas), name);
            this.lastExport = { width: canvas.width, height: canvas.height };
            this.toast(`Exported ${name}: ${items.length} cells of ${cellW}×${cellH}.`);
        } catch (err) {
            this.toast(`Export failed: ${err.message}`, true);
        }
    }

    exportLegacy() {
        if (!this.frames.length) return;
        const base = this.exportBaseName();
        const data = buildLegacyJSON({
            frames: this.frames,
            animations: this.animations,
            sheetName: base,
            entityName: base,
            imagePath: `assets/img/${this.imageName}`,
            imageW: this.source.width,
            imageH: this.source.height,
            anchor: $('sg-anchor').value,
        });
        download(JSON.stringify(data, null, 2), `${base}_site.json`);
        const sheet = data.spritesheets[base];
        const uniform = this.frames.every((f) => f.w === sheet.frameWidth && f.h === sheet.frameHeight);
        this.toast(uniform
            ? `Exported ${base}_site.json. Paste its two parts into spritesheets.json and animations.json.`
            : `Exported ${base}_site.json. That format has one frame size, so every frame uses a ${sheet.frameWidth}×${sheet.frameHeight} box.`);
    }

    // ------------------------------------------------------------------

    toast(message, isError = false) {
        const el = $('sg-toast');
        el.textContent = message;
        el.classList.toggle('is-error', isError);
        el.classList.add('is-visible');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => el.classList.remove('is-visible'), isError ? 6000 : 3800);
    }
}

const root = document.getElementById('sg-app');
if (root) {
    const app = new SpriteGen(root);
    app.init();
    window.spriteGen = app; // handy from the console
}
