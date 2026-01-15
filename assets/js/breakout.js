/*Breakout game clone javascript by Richard Talbot.
Have fun.  Use as you please. 

 */
var Vector = function(dox, doy) { this.dx = dox; this.dy = doy; }

Vector.prototype = {
	invertx: function() { this.dx = -this.dx; },
	inverty: function() { this.dy = -this.dy; },
	appcone: function(x) { 
		this.dx = -Math.sin(-x);		
		this.dy = -Math.cos(x); 
		}
}

var Rectangle = function(xpos,ypos,w,h) {
 this.x = xpos;
 this.y = ypos;
 this.width = w;
 this.height = h;
}

Rectangle.prototype = {	
	top: function() { return this.y; },
	left: function() { return this.x; },
	right: function() { return this.x + this.width; },
	bottom: function() { return this.y + this.height; },
	collides: function(r2) {
		return !(r2.left()>this.right()
				||r2.right()<this.left()
				||r2.top()>this.bottom()
				||r2.bottom()<this.top());
	}
}

var Circle = function(xpos, ypos, radius, dox, doy, dobtm) { 
	this.x = xpos; 
	this.y = ypos; 
	this.r = radius; 
	this.v = new Vector(dox, doy);
	this.color = "#0000FF";
	this.dofloor = dobtm;
	this.active = true;
	this.acount = 0;
	this.aframes = 7;
}

Circle.prototype = {
	speedfactor: 3,
	box: function() { 
		var pareto = (4 * this.r/5);
		return new Rectangle(this.x - pareto, this.y - pareto, pareto, pareto);
	},
	area: function() { return Math.PI * this.r * this.r; },
	setcolor: function(rval, gval, bval, tval) { this.color = "rgba("+rval+","+gval+","+bval+","+tval+")"; },
	setvector: function(dox, doy) { this.vector = new vector(dox, doy); },	 
	render: function(context, di) {
		if (this.active) {
			context.fillStyle = this.getcolor();
			context.beginPath();
			context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		}

		if (this.acount < this.aframes) {
			this.acount++;
		} else {
			this.acount = 0;
		}
	},
	getcolor: function() {
		return "#0088FF";
	},
	collides: function(r2, f){
		if(!this.active)
			return false;
			
		if(r2.collides(this.box())) {		
			if(f) {
				this.v = f(this.x, this.v);
			}
			else {
				this.v.dy = -this.v.dy;
			}
			return true;
		}
		return false;
	},
	collideswall: function(w, h) {	
	  if(!this.active) {
		return false;
		}
	  //Do Floor
	  if(this.y + this.v.dy > h) {
		this.dofloor();
		this.active = false;
		}
	  //Do Left
	  //Do Right
	  if (this.x + this.v.dx > w || this.x + this.v.dx < 0)
		this.v.dx = -this.v.dx; 	  
	  //Do Top
	  if (this.y + this.v.dy < 0) //*Removed for fallthru: this.y + this.v.dy > h || 
		this.v.dy = -this.v.dy;
	},
	move: function() {
		if(this.active) {
			this.x += this.speedfactor * this.v.dx;
			this.y += this.speedfactor * this.v.dy;
		}
	}
}

var Paddle = function(xpos, ypos, w, h) {
	this.x = xpos;
	this.y = ypos;
	this.width = w;
	this.height = h;
}

Paddle.prototype = {
	box: function() { return new Rectangle(this.x, this.y, this.width, this.height); },
	moveto: function(xpos) { this.x = xpos;	},
	moveleft: function(){ if(this.x > 0) this.x -= 16;	},
	moveright: function(lim){ if(this.x < lim - this.width) this.x += 16; },
	render: function(context){
		context.fillStyle = "#333333";
		context.beginPath();
		context.rect(this.x, this.y, this.width, this.height);
		context.closePath();
		context.fill();
	},
	collides: function(r2){
		return r2.collides(this.box());
	},
	collider: function() {
		var p = this;  
		return function(x, v) {	
			var absx = x - p.x;			
			var w = absx - p.width/2;			
			var n = w / (p.width/2);
			v.appcone(n);
			return v;
		}
	}
}


var Brick = function(xpos, ypos, w, h, hp){
	this.x = xpos;
	this.y = ypos;
	this.width = w;
	this.height = h;
	this.hitpoints = hp;
}

Brick.prototype = {
	active: true,
	color: "#FF0000",
	setcolor: function(rval, gval, bval, tval) { this.color = "rgba("+rval+","+gval+","+bval+","+tval+")"; },
	box: function() { return new Rectangle(this.x, this.y, this.width, this.height); },
	render: function(context){
		if(this.active){
			context.fillStyle = this.color;
			context.beginPath();
			context.rect(this.x, this.y, this.width, this.height);
			context.closePath();
			context.fill();
		}
	},
	collides: function(r2){
		if(!this.active) 
			return false;
		
		if(r2.collides(this.box())) {
			this.hitpoints--;
			if(this.hitpoints<=0) this.active = false;
			return true;
		}	
		return false;
	}
} 

var CanvasText = function(txt, xpos, ypos, animated) {	
	this.x = xpos;
	this.y = ypos;
	this.text = txt;
	this.animated = animated || false;
	this.animTime = 0;	
}

CanvasText.prototype = {
	render: function(context) {
		if (this.animated) {
			this.animTime += 0.05;
			var scale = 1 + Math.sin(this.animTime * 2) * 0.1;
			var alpha = 0.7 + Math.sin(this.animTime * 3) * 0.3;
			
			context.save();
			context.translate(this.x, this.y);
			context.scale(scale, scale);
			context.globalAlpha = alpha;
			context.fillStyle = "#000000";
			context.font = "bold 40px sans-serif";
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.fillText(this.text, 0, 0);
			context.restore();
		} else {
			context.fillStyle = "#000000";
			context.font = "bold 20px sans-serif";
			context.textBaseline = "top";
			context.fillText(this.text, this.x, this.y);
		}
	}
}

var Level = function(w, h, levelData) {
	this.b = [];
	this.aframes = 10;
	this.acount = 0;
	this.completed = false;
	this.name = levelData.name;
	this.totalBricks = 0;
	this.activeBricks = 0;
	
	var ycount = levelData.rows;
	var xcount = levelData.cols;
	var bh = levelData.brickHeight;
	var bw = (w - 200) / xcount;
	var bx = 81;
	var by = levelData.startY;
	var bpad = levelData.brickPadding;
	
	for(v = 0; v < ycount; v++) {
		var temp = [];
		for(z = 0; z < xcount; z++) {
			var vby = by + ((bh + bpad) * v);
			var vbx = bx + ((bw + bpad) * z);
			var hitpoints = levelData.layout[v][z];
			
			if (hitpoints > 0) {
				temp[z] = new Brick(vbx, vby, bw, bh, hitpoints);
				this.totalBricks++;
				this.activeBricks++;
			} else {
				temp[z] = null;
			}
		}
		this.b[v] = temp;
	}
}

Level.prototype = {
	render: function(context) {
		var activeBrickCount = 0;
		for(v = 0; v < this.b.length; v++) {
			var temp = this.b[v];
			for(z = 0; z < temp.length; z++) {
				if (temp[z]) {
					temp[z].color = this.getcolor(temp[z].hitpoints);
					temp[z].render(context);
					if (temp[z].active) activeBrickCount++;
				}
			}
		}
		this.activeBricks = activeBrickCount;
		this.completed = (activeBrickCount === 0);
		
		if(this.acount < this.aframes) {
			this.acount++;
		} else {
			this.acount = 0;
		}
	},
	getcolor: function(n) {
		switch(n) {
			case 0: return "#0000FF";
			case 1: return "#00FF00";
			case 2: return "#FF0000";
			case 3: return "#990099";
			default: return "#FFFFFF";
		}
	},
	collides: function(crc, onsuccess) {
		for(v = 0; v < this.b.length; v++) {
			var temp = this.b[v];
			for(z = 0; z < temp.length; z++) {
				if (temp[z] && crc.collides(temp[z])) {
					onsuccess();
				}
			}
		}
	}
}

var Game = function(w, h){
	this.width = w;
	this.height = h;
	this.lifecount = 5;
	this.levels = [];
	this.levelData = [];
	this.activelevel = 0;
	this.score = 0;
	this.balls = [];
	this.ballcount = 0;
	this.ballindex = 0;
	this.paddle = new Paddle(this.width/2 - 75, this.height - 18, 150, 15);
	this.starttxt = new CanvasText("CLICK TO START", this.width/2, this.height/2, true);
	this.gameovertxt = new CanvasText("GAME OVER", this.width/2, this.height/2, true);
	this.nextBallTxt = new CanvasText("NEXT BALL", this.width/2, this.height/2 - 80, true);
	this.levelCompleteTxt = new CanvasText("LEVEL COMPLETE!", this.width/2, this.height/2, true);
	this.lifetxt = new CanvasText("Lives: " + this.lifecount, 5, 30);
	this.scrtxt = new CanvasText("Score: " + this.score, 5, 5);
	this.leveltxt = new CanvasText("Level: 1", this.width - 120, 5);
	this.waitingBall = null;
	this.showInstructions = false;
	this.levelComplete = false;
	this.allLevelsComplete = false;
	
	// Sound effects
	this.sounds = {
		paddle: this.createSound(200, 0.1),
		brick: this.createSound(400, 0.1),
		wall: this.createSound(150, 0.05),
		gameover: this.createSound(100, 0.3),
		levelcomplete: this.createSound(600, 0.5)
	};
	
	this.started = false;
	this.paused = false;
	this.gameover = false;
	this.live = false;
	
	// Load levels
	this.loadLevels();
}

Game.prototype = {
	loadLevels: function() {
		var self = this;
		fetch('/assets/data/breakout-levels.json')
			.then(function(response) { return response.json(); })
			.then(function(data) {
				self.levelData = data.levels;
				self.loadLevel(0);
			})
			.catch(function(error) {
				console.error('Error loading levels:', error);
			});
	},
	loadLevel: function(levelIndex) {
		if (levelIndex < this.levelData.length) {
			this.activelevel = levelIndex;
			this.levels[levelIndex] = new Level(this.width, this.height, this.levelData[levelIndex]);
			this.leveltxt.text = "Level: " + (levelIndex + 1);
			this.levelComplete = false;
		} else {
			this.allLevelsComplete = true;
		}
	},
	nextLevel: function() {
		this.levelComplete = false;
		// Clear all balls
		for(var i = 0; i < this.balls.length; i++) {
			this.balls[i].active = false;
		}
		this.balls = [];
		this.ballindex = 0;
		this.waitingBall = null;
		this.live = false;
		
		this.loadLevel(this.activelevel + 1);
		if (!this.allLevelsComplete) {
			this.sounds.levelcomplete();
			setTimeout(function() {
				this.addball();
			}.bind(this), 1000);
		}
	},
	reset: function() {
		// Reset game state
		this.lifecount = 5;
		this.activelevel = 0;
		this.score = 0;
		this.started = false;
		this.paused = false;
		this.gameover = false;
		this.live = false;
		this.levelComplete = false;
		this.allLevelsComplete = false;
		this.waitingBall = null;
		
		// Clear all balls
		for(var i = 0; i < this.balls.length; i++) {
			this.balls[i].active = false;
		}
		this.balls = [];
		this.ballindex = 0;
		
		// Reload first level
		this.loadLevel(0);
	},
	createSound: function(frequency, duration) {
		return function() {
			try {
				var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
				var oscillator = audioCtx.createOscillator();
				var gainNode = audioCtx.createGain();
				
				oscillator.connect(gainNode);
				gainNode.connect(audioCtx.destination);
				
				oscillator.frequency.value = frequency;
				oscillator.type = 'sine';
				
				gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
				
				oscillator.start(audioCtx.currentTime);
				oscillator.stop(audioCtx.currentTime + duration);
			} catch(e) {}
		};
	},
	toggleInstructions: function() {
		this.showInstructions = !this.showInstructions;
	},
	draw: function(context, drawinterval) {
		if(this.allLevelsComplete) {
			var winTxt = new CanvasText("YOU WIN! ALL LEVELS COMPLETE!", this.width/2, this.height/2, true);
			winTxt.render(context);
			return;
		}
		
		if(this.gameover) {
			this.gameovertxt.render(context);
			return;			
		}
		
		if(!this.started) {
			this.starttxt.render(context);
			return;
		}
		
		if(this.levelComplete) {
			this.levelCompleteTxt.render(context);
			return;
		}
		
		this.paddle.render(context);		
		this.lifetxt.text = "Lives: " + this.lifecount;
		this.scrtxt.text = "Score: " + this.score;
		this.lifetxt.render(context);
		this.scrtxt.render(context);
		this.leveltxt.render(context);
			 
		if (this.levels[this.activelevel]) {
			this.levels[this.activelevel].render(context);
			
			// Check if level is complete
			if (this.levels[this.activelevel].completed && !this.levelComplete) {
				this.levelComplete = true;
				var self = this;
				setTimeout(function() {
					self.nextLevel();
				}, 2000);
			}
		}	  
		
		// Show waiting ball if no active balls
		if (!this.live && this.waitingBall) {
			this.waitingBall.render(context, drawinterval);
			
			// Show animated "Next Ball" text with semi-transparency
			context.save();
			context.globalAlpha = 0.7;
			this.nextBallTxt.render(context);
			context.restore();
		}
		  
		for(n=0;n<this.balls.length;n++) {
			if(this.balls[n].active) {
				this.balls[n].render(context, drawinterval);
				this.balls[n].collideswall(this.width, this.height);
				
				if(this.balls[n].collides(this.paddle.box(), this.paddle.collider())) {
					this.sounds.paddle();
				}
				
				var self = this;
				if (this.levels[this.activelevel]) {
					this.levels[this.activelevel].collides(this.balls[n], function() {
						self.addscore(10)();
						self.sounds.brick();
					});
				}
				
				if(!this.paused) {
					this.balls[n].move();
				}
			}
		}
		
		// Draw instructions panel
		if (this.showInstructions) {
			context.fillStyle = "rgba(0, 0, 0, 0.8)";
			context.fillRect(this.width/2 - 200, this.height/2 - 150, 400, 300);
			
			context.fillStyle = "#FFFFFF";
			context.font = "bold 24px sans-serif";
			context.textAlign = "center";
			context.fillText("CONTROLS", this.width/2, this.height/2 - 110);
			
			context.font = "16px sans-serif";
			context.textAlign = "left";
			var instructions = [
				"Mouse/Touch: Move paddle",
				"Click: Start game / Launch ball",
				"Arrow Keys: Move paddle",
				"P: Pause",
				"Z: Speed up",
				"X: Slow down",
				"V: Bigger ball",
				"C: Smaller ball",
				"I: Toggle instructions"
			];
			var yPos = this.height/2 - 70;
			for (var i = 0; i < instructions.length; i++) {
				context.fillText(instructions[i], this.width/2 - 180, yPos);
				yPos += 30;
			}
		}		
	},
	startgame: function() {
		this.started = true;
		this.addball();
	},
	addball: function() {			
		var newball = new Circle(this.width/2, this.height/2, 10, 0, 1, this.endlife());
		newball.active = false;
		this.waitingBall = newball;
		this.balls[this.ballindex++] = newball;
	},
	launchBall: function() {
		if (this.waitingBall) {
			this.waitingBall.active = true;
			this.live = true;
			this.waitingBall = null;
		}
	},
	pause: function() {
		this.paused = !this.paused;
	},
	mousemove: function(x) {
		if(!this.paused) {
			this.paddle.moveto(x - this.paddle.width/2);
		  }
	},	
	moveleft: function() {
		this.paddle.moveleft();
	},
	moveright: function() {
		this.paddle.moveright(this.width);
	},
	newlife: function() {
		if(!this.paused && !this.gameover) {
			this.addball();
		}
	},
	endlife: function() {
		var g = this;
		return function () {
			g.lifecount -= 1;
			g.live = false;
			g.gameover = g.lifecount == 0;
			if (g.gameover) {
				g.sounds.gameover();
			} else {
				// Automatically create waiting ball for next life
				setTimeout(function() {
					g.addball();
				}, 500);
			}
		}
	},
	addscore: function(n) {
		var g = this;
		return function() {
			g.score += n;
		}
	},
	slow: function() {
		for(n=0;n<this.balls.length;n++) {
			if(this.balls[n].active) {
				this.balls[n].speedfactor--;
			}
		}
	},
	speed: function() {
		for(n=0;n<this.balls.length;n++) {
			if(this.balls[n].active) {
				this.balls[n].speedfactor++;
			}
		}
	},
	embiggen: function() {
		for(n=0;n<this.balls.length;n++) {
			if(this.balls[n].active) {
				this.balls[n].r++;
			}
		}
	},
	shrink: function() {
		for(n=0;n<this.balls.length;n++) {
			if(this.balls[n].active) {
				this.balls[n].r--;
			}
		}
	},
	invinsible: function() {
		this.paddle.width = this.width;
	},
	paddlewidth: function(n) {
		this.paddle.width = n;
	}	
}