// InputHandler - Manages keyboard and other input events
class InputHandler {
    constructor(target = document) {
        this.target = target;
        this.keyHandlers = new Map();
        this.pressedKeys = new Set();
        
        this.target.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.target.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event) {
        const key = event.code || event.key;
        
        // Prevent default for arrow keys and space to avoid page scrolling
        if (key.startsWith('Arrow') || key === 'Space') {
            event.preventDefault();
        }

        // Only trigger if not already pressed (prevents key repeat)
        if (!this.pressedKeys.has(key)) {
            this.pressedKeys.add(key);
            
            if (this.keyHandlers.has(key)) {
                const handler = this.keyHandlers.get(key);
                handler(event);
            }
        }
    }

    handleKeyUp(event) {
        const key = event.code || event.key;
        this.pressedKeys.delete(key);
    }

    on(keyCode, callback) {
        this.keyHandlers.set(keyCode, callback);
    }

    off(keyCode) {
        this.keyHandlers.delete(keyCode);
    }

    bindEntity(entity, controls) {
        if (!entity || !controls) return;

        for (const [keyCode, control] of Object.entries(controls)) {
            this.on(keyCode, () => {
                if (typeof control === 'function') {
                    control(entity);
                } else if (typeof control === 'object') {
                    const action = control.action;
                    const amount = control.amount || 1;

                    if (typeof entity[action] === 'function') {
                        entity[action](amount);
                    }
                }
            });
        }
    }

    bindScene(scene, entity) {
        if (!entity || !entity.controls) return;

        for (const [keyCode, control] of Object.entries(entity.controls)) {
            this.on(keyCode, () => {
                const action = control.action;
                const amount = control.amount || 1;

                // Handle special scene actions
                if (action === 'spawnEntity') {
                    const entityType = control.entityType;
                    scene.spawnEntity(entityType);
                } else if (typeof entity[action] === 'function') {
                    entity[action](amount);
                }
            });
        }
    }

    isPressed(keyCode) {
        return this.pressedKeys.has(keyCode);
    }

    clear() {
        this.keyHandlers.clear();
        this.pressedKeys.clear();
    }
}
