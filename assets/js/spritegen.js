// SpriteGenApp - Main application class for sprite sheet generator
class SpriteGenApp {
    constructor() {
        this.image = null;
        this.frames = [];
        this.animations = new Map();
        this.selectedFrame = null;
        this.selectedAnimation = null;
        this.canvas = null;
        this.ctx = null;
        this.previewCanvas = null;
        this.previewCtx = null;
        this.zoom = 1;
        this.mode = 'select'; // select, draw, edit
        this.isDragging = false;
        this.dragStart = null;
        this.currentRect = null;
        this.spriteManager = null;
        this.previewScene = null;
        this.speedMultiplier = 1.0;
    }

    initialize() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupPreview();
    }

    setupCanvas() {
        this.canvas = document.getElementById('editor-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.previewCanvas = document.getElementById('preview-canvas');
        this.previewCtx = this.previewCanvas.getContext('2d');
        this.previewCtx.imageSmoothingEnabled = false;
    }

    setupPreview() {
        this.spriteManager = new SpriteManager();
        this.previewScene = new GameScene(this.previewCanvas, this.spriteManager);
        this.previewCanvas.style.backgroundColor = '#82CAFA';
    }

    setupEventListeners() {
        // Upload
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.loadImage(file);
            }
        });

        // Detection buttons
        document.getElementById('detect-grid').addEventListener('click', () => this.detectGrid());
        document.getElementById('detect-auto').addEventListener('click', () => this.detectAuto());
        document.getElementById('manual-mode').addEventListener('click', () => this.enterManualMode());
        document.getElementById('clear-frames').addEventListener('click', () => this.clearFrames());

        // Animation buttons
        document.getElementById('new-animation').addEventListener('click', () => this.createAnimation());

        // Preview controls
        document.getElementById('animation-select').addEventListener('change', (e) => this.selectPreviewAnimation(e.target.value));
        document.getElementById('play-animation').addEventListener('click', () => this.playPreview());
        document.getElementById('pause-animation').addEventListener('click', () => this.pausePreview());
        document.getElementById('preview-scale').addEventListener('input', async (e) => {
            document.getElementById('preview-scale-value').textContent = e.target.value + 'x';
            if (this.selectedAnimation) {
                await this.updatePreview();
            }
        });
        document.getElementById('preview-speed').addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            document.getElementById('preview-speed-value').textContent = speed.toFixed(1) + 'x';
            this.updatePreviewSpeed(speed);
        });

        // Export buttons
        document.getElementById('export-json').addEventListener('click', () => this.exportJSON());
        document.getElementById('export-combined').addEventListener('click', () => this.exportCombined());

        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => this.adjustZoom(0.1));
        document.getElementById('zoom-out').addEventListener('click', () => this.adjustZoom(-0.1));
        document.getElementById('zoom-fit').addEventListener('click', () => this.zoomToFit());
        
        // Grid and label controls
        document.getElementById('show-grid').addEventListener('change', () => this.redrawCanvas());
        document.getElementById('show-labels').addEventListener('change', () => this.redrawCanvas());
        
        // Suggest animations
        document.getElementById('suggest-animations').addEventListener('click', () => this.suggestAnimations());

        // Canvas interaction
        this.canvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleCanvasMouseUp(e));
    }

    async handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            await this.loadImage(file);
        }
    }

    async loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.image = img;
                    this.setupImageCanvas();
                    this.showImageInfo(file.name, img.width, img.height);
                    this.showSection('detect-section');
                    resolve();
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    setupImageCanvas() {
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        this.redrawCanvas();
        this.zoomToFit();
    }

    showImageInfo(name, width, height) {
        document.getElementById('image-name').textContent = name;
        document.getElementById('image-dimensions').textContent = `${width} × ${height}px`;
        document.getElementById('image-info').style.display = 'block';
    }

    showSection(sectionId) {
        document.getElementById(sectionId).style.display = 'block';
    }

    detectGrid() {
        if (!this.image) return;

        const frameWidth = parseInt(document.getElementById('frame-width').value) || 32;
        const frameHeight = parseInt(document.getElementById('frame-height').value) || 32;
        const padding = parseInt(document.getElementById('frame-padding').value) || 0;

        this.frames = [];
        const cols = Math.floor(this.image.width / (frameWidth + padding));
        const rows = Math.floor(this.image.height / (frameHeight + padding));

        let frameIndex = 1;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.frames.push({
                    id: `frame_${frameIndex++}`,
                    name: `frame_${String(frameIndex - 1).padStart(3, '0')}`,
                    x: col * (frameWidth + padding),
                    y: row * (frameHeight + padding),
                    width: frameWidth,
                    height: frameHeight,
                    duration: 0.2
                });
            }
        }

        this.updateFramesList();
        this.redrawCanvas();
        this.showSection('frames-section');
        this.showSection('animation-section');
        this.showSection('export-section');
        document.getElementById('suggest-animations-group').style.display = 'block';
    }

    detectAuto() {
        if (!this.image) return;

        // Draw image to canvas for pixel analysis
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.image.width;
        tempCanvas.height = this.image.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.image, 0, 0);

        const imageData = tempCtx.getImageData(0, 0, this.image.width, this.image.height);
        const detectedFrames = this.detectFramesByTransparency(imageData);

        if (detectedFrames.length > 0) {
            this.frames = detectedFrames;
            this.updateFramesList();
            this.redrawCanvas();
            this.showSection('frames-section');
            this.showSection('animation-section');
            this.showSection('export-section');
            document.getElementById('suggest-animations-group').style.display = 'block';
        } else {
            alert('No frames detected. Try grid detection or manual selection.');
        }
    }

    detectFramesByTransparency(imageData) {
        const { width, height, data } = imageData;
        const visited = new Array(width * height).fill(false);
        const frames = [];

        const isTransparent = (x, y) => {
            const idx = (y * width + x) * 4;
            return data[idx + 3] < 10; // Alpha < 10 is transparent
        };

        const floodFill = (startX, startY) => {
            const stack = [[startX, startY]];
            let minX = startX, minY = startY, maxX = startX, maxY = startY;

            while (stack.length > 0) {
                const [x, y] = stack.pop();
                
                if (x < 0 || x >= width || y < 0 || y >= height) continue;
                const idx = y * width + x;
                if (visited[idx] || isTransparent(x, y)) continue;

                visited[idx] = true;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);

                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }

            return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
        };

        let frameIndex = 1;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                if (!visited[idx] && !isTransparent(x, y)) {
                    const bounds = floodFill(x, y);
                    if (bounds.width > 2 && bounds.height > 2) { // Filter out noise
                        frames.push({
                            id: `frame_${frameIndex}`,
                            name: `frame_${String(frameIndex).padStart(3, '0')}`,
                            x: bounds.x,
                            y: bounds.y,
                            width: bounds.width,
                            height: bounds.height,
                            duration: 0.2
                        });
                        frameIndex++;
                    }
                }
            }
        }

        return frames;
    }

    enterManualMode() {
        this.mode = 'draw';
        alert('Click and drag on the canvas to select sprite frames.');
    }

    handleCanvasMouseDown(e) {
        if (!this.image) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;

        if (this.mode === 'draw') {
            this.isDragging = true;
            this.dragStart = { x, y };
            this.currentRect = { x, y, width: 0, height: 0 };
        } else if (this.mode === 'select') {
            // Check if clicking on existing frame
            const clickedFrame = this.frames.find(f => 
                x >= f.x && x <= f.x + f.width &&
                y >= f.y && y <= f.y + f.height
            );
            if (clickedFrame) {
                this.selectFrame(clickedFrame);
            }
        }
    }

    handleCanvasMouseMove(e) {
        if (!this.isDragging || !this.dragStart) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;

        this.currentRect = {
            x: Math.min(this.dragStart.x, x),
            y: Math.min(this.dragStart.y, y),
            width: Math.abs(x - this.dragStart.x),
            height: Math.abs(y - this.dragStart.y)
        };

        this.redrawCanvas();
    }

    handleCanvasMouseUp(e) {
        if (this.isDragging && this.currentRect && this.currentRect.width > 5 && this.currentRect.height > 5) {
            const frameIndex = this.frames.length + 1;
            
            let x = Math.round(this.currentRect.x);
            let y = Math.round(this.currentRect.y);
            let width = Math.round(this.currentRect.width);
            let height = Math.round(this.currentRect.height);
            
            // Apply snap to grid if enabled
            const snapToGrid = document.getElementById('snap-to-grid');
            if (snapToGrid && snapToGrid.checked) {
                const gridSize = parseInt(document.getElementById('frame-width').value) || 32;
                x = Math.round(x / gridSize) * gridSize;
                y = Math.round(y / gridSize) * gridSize;
                width = Math.round(width / gridSize) * gridSize;
                height = Math.round(height / gridSize) * gridSize;
            }
            
            this.frames.push({
                id: `frame_${frameIndex}`,
                name: `frame_${String(frameIndex).padStart(3, '0')}`,
                x: x,
                y: y,
                width: width,
                height: height,
                duration: 0.2
            });
            this.updateFramesList();
            this.showSection('frames-section');
            this.showSection('animation-section');
            this.showSection('export-section');
        }

        this.isDragging = false;
        this.dragStart = null;
        this.currentRect = null;
        this.redrawCanvas();
    }

    redrawCanvas() {
        if (!this.image) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);

        // Draw grid if enabled
        const showGrid = document.getElementById('show-grid');
        if (showGrid && showGrid.checked) {
            this.drawGrid();
        }

        // Draw frames
        const showLabels = document.getElementById('show-labels');
        const shouldShowLabels = !showLabels || showLabels.checked;
        
        this.frames.forEach(frame => {
            this.ctx.strokeStyle = frame === this.selectedFrame ? '#82CAFA' : '#0e7d0e';
            this.ctx.lineWidth = frame === this.selectedFrame ? 3 : 2;
            this.ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
            
            // Draw frame label only if enabled
            if (shouldShowLabels) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(frame.x, frame.y, Math.min(frame.width, 80), 20);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px monospace';
                this.ctx.fillText(frame.name.substring(0, 10), frame.x + 2, frame.y + 14);
            }
        });

        // Draw current selection rectangle
        if (this.currentRect && this.isDragging) {
            this.ctx.strokeStyle = '#82CAFA';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(this.currentRect.x, this.currentRect.y, this.currentRect.width, this.currentRect.height);
            this.ctx.setLineDash([]);
        }
    }

    drawGrid() {
        const frameWidth = parseInt(document.getElementById('frame-width').value) || 32;
        const frameHeight = parseInt(document.getElementById('frame-height').value) || 32;
        const padding = parseInt(document.getElementById('frame-padding').value) || 0;

        this.ctx.strokeStyle = 'rgba(130, 202, 250, 0.3)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < this.image.width; x += frameWidth + padding) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.image.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < this.image.height; y += frameHeight + padding) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.image.width, y);
            this.ctx.stroke();
        }
    }

    updateFramesList() {
        const frameList = document.getElementById('frame-list');
        frameList.innerHTML = '';

        document.getElementById('frame-count').textContent = this.frames.length;

        this.frames.forEach((frame, index) => {
            const frameItem = document.createElement('div');
            frameItem.className = 'frame-item';
            if (frame === this.selectedFrame) {
                frameItem.classList.add('selected');
            }

            const preview = document.createElement('canvas');
            preview.className = 'frame-preview';
            preview.width = 40;
            preview.height = 40;
            const previewCtx = preview.getContext('2d');
            previewCtx.imageSmoothingEnabled = false;

            if (this.image) {
                const scale = Math.min(40 / frame.width, 40 / frame.height);
                const sw = frame.width;
                const sh = frame.height;
                const dw = sw * scale;
                const dh = sh * scale;
                const dx = (40 - dw) / 2;
                const dy = (40 - dh) / 2;
                previewCtx.drawImage(this.image, frame.x, frame.y, sw, sh, dx, dy, dw, dh);
            }

            const info = document.createElement('div');
            info.className = 'frame-info';
            
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = frame.name;
            nameInput.addEventListener('change', (e) => {
                frame.name = e.target.value;
                this.redrawCanvas();
            });
            nameInput.addEventListener('click', (e) => e.stopPropagation());

            info.appendChild(nameInput);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'frame-delete';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteFrame(index);
            });

            frameItem.appendChild(preview);
            frameItem.appendChild(info);
            frameItem.appendChild(deleteBtn);

            frameItem.addEventListener('click', () => this.selectFrame(frame));

            frameList.appendChild(frameItem);
        });
    }

    selectFrame(frame) {
        this.selectedFrame = frame;
        this.updateFramesList();
        this.redrawCanvas();
        document.getElementById('selected-frame-info').textContent = frame.name;
    }

    deleteFrame(index) {
        this.frames.splice(index, 1);
        if (this.selectedFrame === this.frames[index]) {
            this.selectedFrame = null;
        }
        this.updateFramesList();
        this.redrawCanvas();
    }

    clearFrames() {
        if (confirm('Clear all frames?')) {
            this.frames = [];
            this.selectedFrame = null;
            this.updateFramesList();
            this.redrawCanvas();
        }
    }

    adjustZoom(delta) {
        this.zoom = Math.max(0.1, Math.min(5, this.zoom + delta));
        document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
        this.canvas.style.transform = `scale(${this.zoom})`;
        this.canvas.style.transformOrigin = 'top left';
    }

    zoomToFit() {
        if (!this.image) return;
        const container = document.getElementById('canvas-container');
        const scaleX = container.clientWidth / this.image.width;
        const scaleY = container.clientHeight / this.image.height;
        this.zoom = Math.min(scaleX, scaleY, 1) * 0.9;
        document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
        this.canvas.style.transform = `scale(${this.zoom})`;
        this.canvas.style.transformOrigin = 'top left';
    }

    createAnimation() {
        const name = document.getElementById('new-animation-name').value.trim();
        if (!name) {
            alert('Please enter an animation name');
            return;
        }

        if (this.animations.has(name)) {
            alert('Animation with this name already exists');
            return;
        }

        this.animations.set(name, []);
        this.updateAnimationsList();
        document.getElementById('new-animation-name').value = '';
    }

    updateAnimationsList() {
        const animList = document.getElementById('animation-list');
        const animSelect = document.getElementById('animation-select');
        
        animList.innerHTML = '';
        animSelect.innerHTML = '<option value="">-- Select Animation --</option>';

        this.animations.forEach((frames, name) => {
            // Add to select
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            animSelect.appendChild(option);

            // Add to list
            const animItem = document.createElement('div');
            animItem.className = 'animation-item';

            const header = document.createElement('div');
            header.className = 'animation-header';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'animation-name';
            nameSpan.textContent = name;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-small btn-danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteAnimation(name));

            header.appendChild(nameSpan);
            header.appendChild(deleteBtn);

            const framesDiv = document.createElement('div');
            framesDiv.className = 'animation-frames';
            framesDiv.textContent = frames.length === 0 ? 'Drag frames here from the frame list above' : '';

            // Setup drag and drop
            framesDiv.addEventListener('dragover', (e) => e.preventDefault());
            framesDiv.addEventListener('drop', (e) => {
                e.preventDefault();
                const frameId = e.dataTransfer.getData('frameId');
                const frame = this.frames.find(f => f.id === frameId);
                if (frame) {
                    frames.push({ frameId: frame.id, frameName: frame.name, time: frame.duration });
                    this.updateAnimationsList();
                }
            });

            // Render frames in animation
            frames.forEach((animFrame, idx) => {
                const frameDiv = document.createElement('div');
                frameDiv.className = 'animation-frame';
                frameDiv.draggable = true;
                frameDiv.dataset.index = idx;
                frameDiv.dataset.animName = name;
                
                // Find the actual frame data
                const frame = this.frames.find(f => f.name === animFrame.frameName);
                
                if (frame && this.image) {
                    // Create canvas thumbnail
                    const canvas = document.createElement('canvas');
                    canvas.width = 40;
                    canvas.height = 40;
                    canvas.style.imageRendering = 'pixelated';
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = false;
                    
                    const scale = Math.min(40 / frame.width, 40 / frame.height);
                    const sw = frame.width;
                    const sh = frame.height;
                    const dw = sw * scale;
                    const dh = sh * scale;
                    const dx = (40 - dw) / 2;
                    const dy = (40 - dh) / 2;
                    ctx.drawImage(this.image, frame.x, frame.y, sw, sh, dx, dy, dw, dh);
                    
                    frameDiv.appendChild(canvas);
                }

                const timeSpan = document.createElement('span');
                timeSpan.className = 'animation-frame-time';
                timeSpan.textContent = animFrame.time + 's';
                frameDiv.appendChild(timeSpan);
                
                // Add delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'animation-frame-delete';
                deleteBtn.textContent = '×';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    frames.splice(idx, 1);
                    this.updateAnimationsList();
                });
                frameDiv.appendChild(deleteBtn);

                frameDiv.addEventListener('click', () => {
                    const newTime = prompt('Frame duration (seconds):', animFrame.time);
                    if (newTime !== null) {
                        animFrame.time = parseFloat(newTime) || 0.2;
                        this.updateAnimationsList();
                    }
                });
                
                // Drag and drop for reordering
                frameDiv.addEventListener('dragstart', (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', idx);
                    e.dataTransfer.setData('animName', name);
                    frameDiv.style.opacity = '0.5';
                });
                
                frameDiv.addEventListener('dragend', (e) => {
                    frameDiv.style.opacity = '1';
                });
                
                frameDiv.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                });
                
                frameDiv.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    const draggedAnimName = e.dataTransfer.getData('animName');
                    
                    // Only allow reordering within same animation
                    if (draggedAnimName === name && draggedIndex !== idx) {
                        const draggedFrame = frames[draggedIndex];
                        frames.splice(draggedIndex, 1);
                        const newIndex = draggedIndex < idx ? idx - 1 : idx;
                        frames.splice(newIndex, 0, draggedFrame);
                        this.updateAnimationsList();
                    }
                });

                framesDiv.appendChild(frameDiv);
            });

            animItem.appendChild(header);
            animItem.appendChild(framesDiv);
            animList.appendChild(animItem);
        });

        // Make frames draggable
        document.querySelectorAll('.frame-item').forEach((item, idx) => {
            item.draggable = true;
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('frameId', this.frames[idx].id);
            });
        });
    }

    deleteAnimation(name) {
        if (confirm(`Delete animation "${name}"?`)) {
            this.animations.delete(name);
            this.updateAnimationsList();
        }
    }

    async selectPreviewAnimation(animName) {
        if (!animName) return;
        this.selectedAnimation = animName;
        document.getElementById('current-animation-info').textContent = animName;
        await this.updatePreview();
    }

    async updatePreview() {
        if (!this.selectedAnimation || !this.image) return;

        const animFrames = this.animations.get(this.selectedAnimation);
        if (!animFrames || animFrames.length === 0) {
            console.log('No frames in animation');
            return;
        }

        // Create temporary sprite data
        const spritesheetData = this.generateSpritesheetData();
        const animationData = this.generateAnimationData();

        // Create data URL from image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.image.width;
        tempCanvas.height = this.image.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.image, 0, 0);
        const imageDataUrl = tempCanvas.toDataURL();

        // Modify spritesheet data to use data URL
        const spritesheetName = Object.keys(spritesheetData)[0];
        const entityType = document.getElementById('entity-type').value || 'preview';
        spritesheetData[spritesheetName].image = imageDataUrl;

        // Reinitialize sprite manager and scene
        this.previewScene.stop();
        this.previewScene.entities.clear();
        this.spriteManager = new SpriteManager();
        
        // Load into manager
        await this.loadSpritesheetFromObject(spritesheetData);
        await this.loadAnimationFromObject(animationData);

        // Recreate scene with new manager
        this.previewScene = new GameScene(this.previewCanvas, this.spriteManager);
        this.previewCanvas.style.backgroundColor = '#82CAFA';
        
        // Get first frame to determine size
        const firstFrame = this.frames.find(f => f.name === animFrames[0].frameName);
        if (!firstFrame) {
            console.error('First frame not found');
            return;
        }
        
        const frameWidth = firstFrame.width;
        const frameHeight = firstFrame.height;
        
        // Use scale from slider (now 4x-20x range)
        const scale = parseInt(document.getElementById('preview-scale').value) || 8;
        
        // Center the sprite
        const scaledWidth = frameWidth * scale;
        const scaledHeight = frameHeight * scale;
        const x = (this.previewCanvas.width - scaledWidth) / 2;
        const y = (this.previewCanvas.height - scaledHeight) / 2;
        
        const entity = this.spriteManager.createSprite(
            entityType,
            x,
            y,
            this.selectedAnimation,
            scale
        );

        if (entity) {
            this.previewScene.addEntity('preview', entity);
            this.previewScene.start();
        } else {
            console.error('Failed to create preview entity');
        }
    }

    async loadSpritesheetFromObject(data) {
        for (const [name, config] of Object.entries(data)) {
            const spriteData = {
                width: config.frameWidth,
                height: config.frameHeight,
                sprites: []
            };

            for (const [spriteName, coords] of Object.entries(config.sprites)) {
                spriteData.sprites.push({
                    name: spriteName,
                    xpos: coords.x,
                    ypos: coords.y
                });
            }

            this.spriteManager.spritesheets.set(name, {
                sheet: new SpriteSheet(spriteData),
                imagePath: config.image
            });

            await this.loadImageFromDataUrl(name, config.image);
        }
    }

    async loadImageFromDataUrl(name, dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.spriteManager.images.set(name, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    }

    async loadAnimationFromObject(data) {
        for (const [entityType, config] of Object.entries(data)) {
            const animations = new Map();
            const spritesheetName = config.spritesheet;
            const spritesheetData = this.spriteManager.spritesheets.get(spritesheetName);

            if (!spritesheetData) continue;

            for (const [animName, frames] of Object.entries(config.animations)) {
                animations.set(animName, new Animation(frames, spritesheetData.sheet));
            }

            this.spriteManager.entityTypes.set(entityType, {
                spritesheet: spritesheetName,
                animations: animations
            });
        }
    }

    async playPreview() {
        if (!this.selectedAnimation) {
            alert('Please select an animation first');
            return;
        }
        await this.updatePreview();
    }

    pausePreview() {
        this.previewScene.pause();
    }
    
    updatePreviewSpeed(speed) {
        this.speedMultiplier = speed;
        // Update all animation frame durations
        if (this.spriteManager && this.spriteManager.entityTypes.size > 0) {
            this.spriteManager.entityTypes.forEach(entityData => {
                entityData.animations.forEach(animation => {
                    // Store original durations if not already stored
                    if (!animation._originalFrames) {
                        animation._originalFrames = animation._frames.map(f => ({...f}));
                    }
                    // Adjust frame durations based on speed
                    animation._frames.forEach((frame, idx) => {
                        frame.time = animation._originalFrames[idx].time / speed;
                    });
                });
            });
        }
    }

    generateSpritesheetData() {
        const spritesheetName = document.getElementById('spritesheet-name').value || 'my_spritesheet';
        
        const data = {};
        data[spritesheetName] = {
            image: 'assets/img/spritesheet.png', // Placeholder
            frameWidth: this.frames[0]?.width || 32,
            frameHeight: this.frames[0]?.height || 32,
            sprites: {}
        };

        this.frames.forEach(frame => {
            data[spritesheetName].sprites[frame.name] = {
                x: frame.x,
                y: frame.y
            };
        });

        return data;
    }

    generateAnimationData() {
        const entityType = document.getElementById('entity-type').value || 'my_entity';
        const spritesheetName = document.getElementById('spritesheet-name').value || 'my_spritesheet';

        const data = {};
        data[entityType] = {
            spritesheet: spritesheetName,
            animations: {}
        };

        this.animations.forEach((frames, animName) => {
            data[entityType].animations[animName] = frames.map(f => ({
                sprite: f.frameName,
                time: f.time
            }));
        });

        return data;
    }

    exportJSON() {
        const spritesheetData = this.generateSpritesheetData();
        const animationData = this.generateAnimationData();

        this.downloadJSON(spritesheetData, 'spritesheets.json');
        this.downloadJSON(animationData, 'animations.json');

        alert('Exported spritesheets.json and animations.json!');
    }

    exportCombined() {
        const combined = {
            spritesheets: this.generateSpritesheetData(),
            animations: this.generateAnimationData()
        };

        if (document.getElementById('include-scene').checked) {
            combined.scene = this.generateSceneTemplate();
        }

        this.downloadJSON(combined, 'sprite-data.json');
        alert('Exported combined sprite-data.json!');
    }

    generateSceneTemplate() {
        const entityType = document.getElementById('entity-type').value || 'my_entity';
        const firstAnim = this.animations.keys().next().value || 'idle';

        return {
            canvas: {
                backgroundColor: '#82CAFA'
            },
            entities: [
                {
                    id: 'entity1',
                    type: entityType,
                    x: 0,
                    y: '50%',
                    scale: 2,
                    initialAnimation: firstAnim
                }
            ]
        };
    }

    suggestAnimations() {
        if (this.frames.length === 0) {
            alert('Please detect frames first');
            return;
        }
        
        // Group frames by similarity and position patterns
        const groups = this.groupSimilarFrames();
        
        // Create animations from groups
        let animCount = 0;
        groups.forEach((frameGroup, index) => {
            if (frameGroup.length > 1) {
                const animName = `animation_${String(index + 1).padStart(2, '0')}`;
                const frames = frameGroup.map(frameIdx => ({
                    frameId: this.frames[frameIdx].id,
                    frameName: this.frames[frameIdx].name,
                    time: 0.2
                }));
                this.animations.set(animName, frames);
                animCount++;
            }
        });
        
        this.updateAnimationsList();
        alert(`Suggested ${animCount} animations based on frame similarity`);
    }
    
    groupSimilarFrames() {
        // Group frames by position patterns (e.g., same row or column)
        const groups = [];
        const used = new Set();
        
        // Try to find sequential frames in rows
        for (let i = 0; i < this.frames.length; i++) {
            if (used.has(i)) continue;
            
            const frame = this.frames[i];
            const group = [i];
            used.add(i);
            
            // Look for frames in the same row with similar dimensions
            for (let j = i + 1; j < this.frames.length; j++) {
                if (used.has(j)) continue;
                
                const other = this.frames[j];
                const sameRow = Math.abs(frame.y - other.y) < 5;
                const similarSize = Math.abs(frame.width - other.width) < 5 && 
                                  Math.abs(frame.height - other.height) < 5;
                const sequential = other.x > frame.x;
                
                if (sameRow && similarSize && sequential) {
                    group.push(j);
                    used.add(j);
                }
            }
            
            if (group.length > 1) {
                // Sort group by x position
                group.sort((a, b) => this.frames[a].x - this.frames[b].x);
                groups.push(group);
            }
        }
        
        return groups;
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
