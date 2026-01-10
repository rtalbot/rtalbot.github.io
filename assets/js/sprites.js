var FrameTimer = function() {
    this._lastTick = (new Date()).getTime();
}
 
FrameTimer.prototype = {
    getSeconds: function() {
        var seconds = this._frameSpacing / 1000;
        if(isNaN(seconds)) {
            return 0;
        }
 
        return seconds;
    },
 
    tick: function() {
        var currentTick = (new Date()).getTime();
        this._frameSpacing = currentTick - this._lastTick;
        this._lastTick = currentTick;
    }
}

var SpriteSheet = function(data) {
    this.load(data);
}
 
SpriteSheet.prototype = {
    _sprites: [],
    _width: 0,
    _height: 0,
	_xpad: 0,
	_ypad: 0,
 
    load: function(data) {
        this._height = data.height;
        this._width = data.width;
        this._sprites = data.sprites;		
    },
 
    getSprite: function(spriteName) {
        //Go through all sprites to find the required one
        for(var i = 0, len = this._sprites.length; i < len; i++) {
            var sprite = this._sprites[i];
 
            if(sprite.name == spriteName) {
                //To get the offset, multiply by sprite width
                //Sprite-specific x and y offset is then added into it.
                return {
                    x: sprite.xpos,
                    y: sprite.ypos,
                    width: this._width,
                    height: this._height
                };
            }
        }
 
        return null;
    }
}

var Animation = function(data, sprites) {
    this.load(data);
    this._sprites = sprites;
}
 
Animation.prototype = {
    _frames: [],
    _frame: null,
    _frameDuration: 0,
 
    load: function(data) {
        this._frames = data;
 
        //Initialize the first frame
        this._frameIndex = 0;
        this._frameDuration = data[0].time;
    },
 
    animate: function(deltaTime) {
        //Reduce time passed from the duration to show a frame        
        this._frameDuration -= deltaTime;
 
        //When the display duration has passed
        if(this._frameDuration <= 0) {
            //Change to next frame, or the first if ran out of frames
            this._frameIndex++;
            if(this._frameIndex == this._frames.length) {
                this._frameIndex = 0;
            }
 
            //Change duration to duration of new frame
            this._frameDuration = this._frames[this._frameIndex].time;
        }
    },
 
    getFrame: function() {
        //Return the sprite for the current frame
        return this._sprites.getSprite(this._frames[this._frameIndex].sprite);
    }
}

// Utility class for common operations
class Utils {
    static async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON:', error);
            throw error;
        }
    }

    static parsePosition(value, max) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            // Handle percentage values like "50%"
            if (value.includes('%')) {
                const percent = parseFloat(value) / 100;
                return max * percent;
            }
            // Handle calc-like expressions "100%-52"
            if (value.includes('-')) {
                const parts = value.split('-');
                let result = this.parsePosition(parts[0], max);
                for (let i = 1; i < parts.length; i++) {
                    result -= parseFloat(parts[i]);
                }
                return result;
            }
            if (value.includes('+')) {
                const parts = value.split('+');
                let result = this.parsePosition(parts[0], max);
                for (let i = 1; i < parts.length; i++) {
                    result += parseFloat(parts[i]);
                }
                return result;
            }
        }
        return parseFloat(value) || 0;
    }

    static domReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }
}

// SpriteManager - Central management for sprites and animations
class SpriteManager {
    constructor() {
        this.spritesheets = new Map();
        this.animations = new Map();
        this.images = new Map();
        this.entityTypes = new Map();
    }

    async loadSpriteSheetData(url) {
        const data = await Utils.loadJSON(url);
        
        // Load each spritesheet definition
        for (const [name, config] of Object.entries(data)) {
            // Create sprite data array
            const spriteData = {
                width: config.frameWidth,
                height: config.frameHeight,
                sprites: []
            };

            // Convert sprite object to array format
            for (const [spriteName, coords] of Object.entries(config.sprites)) {
                spriteData.sprites.push({
                    name: spriteName,
                    xpos: coords.x,
                    ypos: coords.y
                });
            }

            this.spritesheets.set(name, {
                sheet: new SpriteSheet(spriteData),
                imagePath: config.image
            });

            // Preload image
            await this.loadImage(name, config.image);
        }
    }

    async loadAnimationData(url) {
        const data = await Utils.loadJSON(url);
        
        // Store animation definitions by entity type
        for (const [entityType, config] of Object.entries(data)) {
            const animations = new Map();
            const spritesheetName = config.spritesheet;
            const spritesheetData = this.spritesheets.get(spritesheetName);

            if (!spritesheetData) {
                console.error(`Spritesheet ${spritesheetName} not found for entity ${entityType}`);
                continue;
            }

            // Create Animation objects for each animation
            for (const [animName, frames] of Object.entries(config.animations)) {
                animations.set(animName, new Animation(frames, spritesheetData.sheet));
            }

            this.entityTypes.set(entityType, {
                spritesheet: spritesheetName,
                animations: animations
            });
        }
    }

    async loadImage(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(name, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = path;
        });
    }

    createSprite(entityType, x, y, initialAnimation, scale = 1) {
        const entityData = this.entityTypes.get(entityType);
        if (!entityData) {
            console.error(`Entity type ${entityType} not found`);
            return null;
        }

        const image = this.images.get(entityData.spritesheet);
        return new SpriteEntity(
            entityData.animations,
            image,
            x,
            y,
            initialAnimation,
            scale
        );
    }

    getAnimation(entityType, animationName) {
        const entityData = this.entityTypes.get(entityType);
        if (!entityData) return null;
        return entityData.animations.get(animationName);
    }
}

// SpriteEntity - Represents an individual sprite in the game
class SpriteEntity {
    constructor(animations, image, x, y, initialAnimation, scale = 1) {
        this.animations = animations;
        this.image = image;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.currentAnimation = initialAnimation;
        this.visible = true;
    }

    draw(ctx, deltaTime) {
        if (!this.visible) return;

        const animation = this.animations.get(this.currentAnimation);
        if (!animation) {
            console.error(`Animation ${this.currentAnimation} not found`);
            return;
        }

        animation.animate(deltaTime);
        const frame = animation.getFrame();
        
        if (frame && this.image) {
            ctx.drawImage(
                this.image,
                frame.x,
                frame.y,
                frame.width,
                frame.height,
                this.x,
                this.y,
                frame.width * this.scale,
                frame.height * this.scale
            );
        }
    }

    setAnimation(name) {
        if (this.animations.has(name)) {
            this.currentAnimation = name;
        }
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    moveRight(amount) {
        if (this.animations.has('walk_right')) {
            this.setAnimation('walk_right');
        }
        this.x += amount;
    }

    moveLeft(amount) {
        if (this.animations.has('walk_left')) {
            this.setAnimation('walk_left');
        }
        this.x -= amount;
    }

    moveUp(amount) {
        this.y -= amount;
    }

    moveDown(amount) {
        this.y += amount;
    }
}