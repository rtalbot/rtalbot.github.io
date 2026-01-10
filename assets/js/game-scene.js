// GameScene - Manages the game loop, entities, and rendering
class GameScene {
    constructor(canvas, spriteManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spriteManager = spriteManager;
        this.entities = new Map();
        this.timer = new FrameTimer();
        this.running = false;
        this.animationFrameId = null;
        this.backgroundColor = '#82CAFA';
        
        // Resize canvas to fill window
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    async loadScene(sceneDataOrUrl) {
        let sceneData;
        
        if (typeof sceneDataOrUrl === 'string') {
            sceneData = await Utils.loadJSON(sceneDataOrUrl);
        } else {
            sceneData = sceneDataOrUrl;
        }

        // Set canvas background color
        if (sceneData.canvas && sceneData.canvas.backgroundColor) {
            this.backgroundColor = sceneData.canvas.backgroundColor;
            this.canvas.style.backgroundColor = this.backgroundColor;
        }

        // Load entities
        if (sceneData.entities) {
            for (const entityConfig of sceneData.entities) {
                this.addEntityFromConfig(entityConfig);
            }
        }
    }

    addEntityFromConfig(config) {
        const x = Utils.parsePosition(config.x, this.canvas.width);
        const y = Utils.parsePosition(config.y, this.canvas.height);
        const scale = config.scale || 1;

        const entity = this.spriteManager.createSprite(
            config.type,
            x,
            y,
            config.initialAnimation,
            scale
        );

        if (entity) {
            // Store additional config on entity
            entity.id = config.id;
            entity.controllable = config.controllable || false;
            entity.controls = config.controls || {};
            entity.behavior = config.behavior || null;

            this.entities.set(config.id, entity);
        }

        return entity;
    }

    addEntity(id, entity) {
        this.entities.set(id, entity);
    }

    removeEntity(id) {
        this.entities.delete(id);
    }

    getEntity(id) {
        return this.entities.get(id);
    }

    getControllableEntity() {
        for (const entity of this.entities.values()) {
            if (entity.controllable) {
                return entity;
            }
        }
        return null;
    }

    spawnEntity(entityType, x, y, initialAnimation) {
        const id = `${entityType}_${Date.now()}_${Math.random()}`;
        const entity = this.spriteManager.createSprite(
            entityType,
            x !== undefined ? x : this.canvas.width - 52,
            y !== undefined ? y : Math.floor(Math.random() * this.canvas.height),
            initialAnimation || 'walk_left',
            2
        );

        if (entity) {
            entity.id = id;
            entity.behavior = {
                type: 'patrol',
                speed: 4,
                direction: 'left',
                wrap: true
            };
            this.entities.set(id, entity);
        }

        return entity;
    }

    update(deltaTime) {
        // Update all entities with behaviors
        for (const entity of this.entities.values()) {
            if (entity.behavior) {
                this.updateEntityBehavior(entity, deltaTime);
            }
        }
    }

    updateEntityBehavior(entity, deltaTime) {
        const behavior = entity.behavior;

        if (behavior.type === 'patrol') {
            const speed = behavior.speed || 1;
            const direction = behavior.direction || 'left';

            if (direction === 'left') {
                entity.x -= speed;
                
                if (behavior.wrap && entity.x < -100) {
                    entity.x = this.canvas.width + 100;
                }
            } else if (direction === 'right') {
                entity.x += speed;
                
                if (behavior.wrap && entity.x > this.canvas.width + 100) {
                    entity.x = -100;
                }
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get delta time
        const deltaTime = this.timer.getSeconds();

        // Draw all entities
        for (const entity of this.entities.values()) {
            entity.draw(this.ctx, deltaTime);
        }
    }

    gameLoop() {
        if (!this.running) return;

        const deltaTime = this.timer.getSeconds();
        this.update(deltaTime);
        this.render();
        this.timer.tick();

        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        if (this.running) return;

        this.running = true;
        this.timer.tick();
        this.gameLoop();
    }

    stop() {
        this.running = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    pause() {
        this.running = false;
    }

    resume() {
        if (!this.running) {
            this.running = true;
            this.timer.tick();
            this.gameLoop();
        }
    }
}
