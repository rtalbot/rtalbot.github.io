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