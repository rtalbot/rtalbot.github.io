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

var Circle = function(xpos, ypos, radius, dox, doy, dobtm, img) { 
	this.x = xpos; 
	this.y = ypos; 
	this.r = radius; 
	this.v = new Vector(dox, doy);
	this.color = "#0000FF";
	this.dofloor = dobtm;
	this.active = true;
	this.acount = 0;
	this.aframes = 7;
	this.image = img;
	this.sprites = new SpriteSheet({
                width: 32,
                height: 32,
                sprites: [
                    { name: "roll_1", x: 0, y: 0 },
                    { name: "roll_2", x: 18, y: 0 },
                    { name: "roll_3", x: 36, y: 0 },
					{ name: "roll_4", x: 46, y: 0 }
                ]
            });
	this.roll = new Animation([
                    { sprite: "roll_1", time: 0.1 },
                    { sprite: "roll_2", time: 0.1 },
                    { sprite: "roll_3", time: 0.1 },
					{ sprite: "roll_4", time: 0.1 }
            ], this.sprites);
}

Circle.prototype = {
	speedfactor: 5,
	box: function() { 
		var pareto = (4 * this.r/5);
		return new Rectangle(this.x - pareto, this.y - pareto, pareto, pareto);
	},
	area: function() { return Math.PI * this.r * this.r; },
	setcolor: function(rval, gval, bval, tval) { this.color = "rgba("+rval+","+gval+","+bval+","+tval+")"; },
	setvector: function(dox, doy) { this.vector = new vector(dox, doy); },	 
	render: function(context, di) {
		if(this.active) {
		  context.fillStyle = this.getcolor();
		  context.beginPath();
		  context.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
		  context.closePath();
		  context.fill();
		  //this.roll.animate(di);
          //var frame = this.roll.getSprite();	  
          //context.drawImage(this.image, frame.x, frame.y, 18, 18, this.x, this.y, 32, 32);
	  }
	  
	  if(this.acount < this.aframes) {
		this.acount++;
	  }
	  else {
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

var CanvasText = function(txt, xpos, ypos) {	
	this.x = xpos;
	this.y = ypos;
	this.text = txt;	
}

CanvasText.prototype = {
	render: function(context) {	
		context.fillStyle = "#000000";
		context.font = "bold 20px sans-serif";
		context.textBaseline = "top"; 	
		context.fillText(this.text, this.x, this.y);
	}
}

var Level = function(w, h) {
	this.b = [];
	this.aframes = 10;
	this.acount = 0;
	var ycount = 5;
	var xcount = 20;
	var bh = 10;
	var bw = (w-200)/xcount;
	var bx = 81;
	var by = 100;
	var bpad = 2;	 
	
	for(v=0;v<ycount;v++){
		var temp = [];
		for(z=0;z<xcount;z++){
			var vby = by + ((bh + bpad) * v);
			var vbx = bx + ((bw + bpad) * z);			
			temp[z] = new Brick(vbx, vby, bw, bh, Math.ceil((ycount-v)/ 2));			
		}
		this.b[v] = temp;
	}
}

Level.prototype = {
	render: function(context) {		
			for(v=0;v<this.b.length;v++){
				var temp = this.b[v];
				for(z=0;z<temp.length;z++){	
					temp[z].color = this.getcolor(temp[z].hitpoints);
					temp[z].render(context);
			}
		  }
		  if(this.acount < this.aframes) {
			this.acount++;
		  }
		  else {
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
		for(v=0;v<this.b.length;v++) {
			var temp = this.b[v];
			for(z=0;z<temp.length;z++){					
				if(crc.collides(temp[z])) {
					onsuccess();
				}			
			}
		} 
	}
}

var Game = function(w, h, spriteimg){
	this.sprites = spriteimg;
	this.width = w;
	this.height = h;
	this.lifecount = 5;
	this.levels = [];
	this.activelevel = 0;
	this.score = 0;
	this.balls = [];
	this.ballcount = 0;
	this.ballindex = 0;
	this.paddle = new Paddle(this.width/2 - 75, this.height - 18, 150, 15);
	this.starttxt = new CanvasText("CLICK TO START", this.width/2, this.height/2);
	this.gameovertxt = new CanvasText("GAME OVER", this.width/2, this.height/2);
	this.lifetxt = new CanvasText("Lives: " + this.lifecount, 5, 30);
	this.scrtxt = new CanvasText("Score: " + this.score, 5, 5);
	this.started = false;
	this.paused = false;
	this.gameover = false;
	this.live = false;	
	
	this.levels[0] = new Level(this.width, this.height);
}

Game.prototype = {
	draw: function(context, drawinterval) {
		if(this.gameover) {
			this.gameovertxt.render(context);
			return;			
		}
		
		if(!this.started) {
			this.starttxt.render(context);
			return;
		}
		
		this.paddle.render(context);		
		this.lifetxt.text = "Lives: " + this.lifecount;
		this.scrtxt.text = "Score: " + this.score;
		this.lifetxt.render(context);
		this.scrtxt.render(context);		
			 
		this.levels[0].render(context);	  
		  
		for(n=0;n<this.balls.length;n++) {
			if(this.balls[n].active) {
				this.balls[n].render(context, drawinterval);
				this.balls[n].collideswall(this.width, this.height);
				this.balls[n].collides(this.paddle.box(), this.paddle.collider());
				this.levels[0].collides(this.balls[n], this.addscore(10));
				if(!this.paused) {
					this.balls[n].move();
				}
			}
		}		
	},
	startgame: function() {
		this.started = true;
		this.addball();
	},
	addball: function() {			
		this.live = true;
		var newball = new Circle(this.width/2,this.height/2,10,0,1, this.endlife(), this.sprites);		
		this.balls[this.ballindex++] = newball;
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