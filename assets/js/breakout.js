/*Breakout game clone javascript by Richard Talbot.
Have fun.  Use as you please.
*/

class Vector {
	constructor(dox, doy) {
		this.dx = dox;
		this.dy = doy;
	}

	invertx() { this.dx = -this.dx; }
	inverty() { this.dy = -this.dy; }
	appcone(x) {
		this.dx = -Math.sin(-x);
		this.dy = -Math.cos(x);
	}
}

class Rectangle {
	constructor(xpos, ypos, w, h) {
		this.x = xpos;
		this.y = ypos;
		this.width = w;
		this.height = h;
	}

	top() { return this.y; }
	left() { return this.x; }
	right() { return this.x + this.width; }
	bottom() { return this.y + this.height; }
	collides(r2) {
		return !(r2.left() > this.right()
			|| r2.right() < this.left()
			|| r2.top() > this.bottom()
			|| r2.bottom() < this.top());
	}
}

class Circle {
	constructor(xpos, ypos, radius, dox, doy, dobtm) {
		this.x = xpos;
		this.y = ypos;
		this.r = radius;
		this.v = new Vector(dox, doy);
		this.color = "#0000FF";
		this.dofloor = dobtm;
		this.active = true;
		this.acount = 0;
		this.aframes = 7;
		this.speedfactor = 3;
	}

	box() {
		const pareto = (4 * this.r / 5);
		return new Rectangle(this.x - pareto, this.y - pareto, pareto, pareto);
	}

	area() { return Math.PI * this.r * this.r; }
	setcolor(rval, gval, bval, tval) { this.color = `rgba(${rval},${gval},${bval},${tval})`; }
	setvector(dox, doy) { this.v = new Vector(dox, doy); }

	render(context) {
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
	}

	getcolor() { return "#0088FF"; }

	collides(r2, f) {
		if (!this.active) return false;
		if (r2.collides(this.box())) {
			if (f) {
				this.v = f(this.x, this.v);
			} else {
				this.v.dy = -this.v.dy;
			}
			return true;
		}
		return false;
	}

	collideswall(w, h) {
		if (!this.active) return false;
		// Floor
		if (this.y + this.v.dy > h) {
			this.dofloor();
			this.active = false;
		}
		// Left / Right
		if (this.x + this.v.dx > w || this.x + this.v.dx < 0)
			this.v.dx = -this.v.dx;
		// Top
		if (this.y + this.v.dy < 0)
			this.v.dy = -this.v.dy;
	}

	move() {
		if (this.active) {
			this.x += this.speedfactor * this.v.dx;
			this.y += this.speedfactor * this.v.dy;
		}
	}
}

class Paddle {
	constructor(xpos, ypos, w, h) {
		this.x = xpos;
		this.y = ypos;
		this.width = w;
		this.height = h;
	}

	box() { return new Rectangle(this.x, this.y, this.width, this.height); }
	moveto(xpos) { this.x = xpos; }
	moveleft() { if (this.x > 0) this.x -= 16; }
	moveright(lim) { if (this.x < lim - this.width) this.x += 16; }

	render(context) {
		context.fillStyle = "#333333";
		context.beginPath();
		context.rect(this.x, this.y, this.width, this.height);
		context.closePath();
		context.fill();
	}

	collides(r2) { return r2.collides(this.box()); }

	collider() {
		const p = this;
		return function(x, v) {
			const absx = x - p.x;
			const w = absx - p.width / 2;
			const n = w / (p.width / 2);
			v.appcone(n);
			return v;
		};
	}
}

class Brick {
	constructor(xpos, ypos, w, h, hp) {
		this.x = xpos;
		this.y = ypos;
		this.width = w;
		this.height = h;
		this.hitpoints = hp;
		this.active = true;
		this.color = "#FF0000";
	}

	setcolor(rval, gval, bval, tval) { this.color = `rgba(${rval},${gval},${bval},${tval})`; }
	box() { return new Rectangle(this.x, this.y, this.width, this.height); }

	render(context) {
		if (this.active) {
			context.fillStyle = this.color;
			context.beginPath();
			context.rect(this.x, this.y, this.width, this.height);
			context.closePath();
			context.fill();
		}
	}

	collides(r2) {
		if (!this.active) return false;
		if (r2.collides(this.box())) {
			this.hitpoints--;
			if (this.hitpoints <= 0) this.active = false;
			return true;
		}
		return false;
	}
}

class CanvasText {
	constructor(txt, xpos, ypos, animated) {
		this.x = xpos;
		this.y = ypos;
		this.text = txt;
		this.animated = animated || false;
		this.animTime = 0;
	}

	render(context) {
		if (this.animated) {
			this.animTime += 0.05;
			const scale = 1 + Math.sin(this.animTime * 2) * 0.1;
			const alpha = 0.7 + Math.sin(this.animTime * 3) * 0.3;
			context.save();
			context.translate(this.x, this.y);
			context.scale(scale, scale);
			context.globalAlpha = alpha;
			context.fillStyle = "#FFFFFF";
			context.font = "bold 40px sans-serif";
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.fillText(this.text, 0, 0);
			context.restore();
		} else {
			context.fillStyle = "#FFFFFF";
			context.font = "bold 20px sans-serif";
			context.textBaseline = "top";
			context.fillText(this.text, this.x, this.y);
		}
	}
}

class Level {
	constructor(w, h, levelData) {
		this.b = [];
		this.aframes = 10;
		this.acount = 0;
		this.completed = false;
		this.name = levelData.name;
		this.totalBricks = 0;
		this.activeBricks = 0;

		const ycount = levelData.rows;
		const xcount = levelData.cols;
		const bh = levelData.brickHeight;
		const bw = (w - 200) / xcount;
		const bx = 81;
		const by = levelData.startY;
		const bpad = levelData.brickPadding;

		for (let v = 0; v < ycount; v++) {
			const temp = [];
			for (let z = 0; z < xcount; z++) {
				const vby = by + ((bh + bpad) * v);
				const vbx = bx + ((bw + bpad) * z);
				const hitpoints = levelData.layout[v][z];
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

	render(context) {
		let activeBrickCount = 0;
		for (let v = 0; v < this.b.length; v++) {
			const temp = this.b[v];
			for (let z = 0; z < temp.length; z++) {
				if (temp[z]) {
					temp[z].color = this.getcolor(temp[z].hitpoints);
					temp[z].render(context);
					if (temp[z].active) activeBrickCount++;
				}
			}
		}
		this.activeBricks = activeBrickCount;
		this.completed = (activeBrickCount === 0);
		if (this.acount < this.aframes) {
			this.acount++;
		} else {
			this.acount = 0;
		}
	}

	getcolor(n) {
		switch (n) {
			case 0: return "#0000FF";
			case 1: return "#00FF00";
			case 2: return "#FF0000";
			case 3: return "#990099";
			default: return "#FFFFFF";
		}
	}

	collides(crc, onsuccess) {
		for (let v = 0; v < this.b.length; v++) {
			const temp = this.b[v];
			for (let z = 0; z < temp.length; z++) {
				if (temp[z] && crc.collides(temp[z])) {
					onsuccess();
				}
			}
		}
	}
}

class Game {
	constructor(w, h) {
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
		this.paddle = new Paddle(this.width / 2 - 75, this.height - 18, 150, 15);
		this.starttxt = new CanvasText("CLICK TO START", this.width / 2, this.height / 2, true);
		this.gameovertxt = new CanvasText("GAME OVER", this.width / 2, this.height / 2, true);
		this.nextBallTxt = new CanvasText("NEXT BALL", this.width / 2, this.height / 2 - 80, true);
		this.levelCompleteTxt = new CanvasText("LEVEL COMPLETE!", this.width / 2, this.height / 2, true);
		this.lifetxt = new CanvasText("Lives: " + this.lifecount, 5, 30);
		this.scrtxt = new CanvasText("Score: " + this.score, 5, 5);
		this.leveltxt = new CanvasText("Level: 1", this.width - 120, 5);
		this.waitingBall = null;
		this.showInstructions = false;
		this.levelComplete = false;
		this.allLevelsComplete = false;

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

		this.loadLevels();
	}

	loadLevels() {
		fetch('/assets/data/breakout-levels.json')
			.then(response => response.json())
			.then(data => {
				this.levelData = data.levels;
				this.loadLevel(0);
			})
			.catch(error => {
				console.error('Error loading levels:', error);
			});
	}

	loadLevel(levelIndex) {
		if (levelIndex < this.levelData.length) {
			this.activelevel = levelIndex;
			this.levels[levelIndex] = new Level(this.width, this.height, this.levelData[levelIndex]);
			this.leveltxt.text = "Level: " + (levelIndex + 1);
			this.levelComplete = false;
		} else {
			this.allLevelsComplete = true;
		}
	}

	nextLevel() {
		this.levelComplete = false;
		for (let i = 0; i < this.balls.length; i++) {
			this.balls[i].active = false;
		}
		this.balls = [];
		this.ballindex = 0;
		this.waitingBall = null;
		this.live = false;

		this.loadLevel(this.activelevel + 1);
		if (!this.allLevelsComplete) {
			this.sounds.levelcomplete();
			setTimeout(() => { this.addball(); }, 1000);
		}
	}

	reset() {
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
		for (let i = 0; i < this.balls.length; i++) {
			this.balls[i].active = false;
		}
		this.balls = [];
		this.ballindex = 0;
		this.loadLevel(0);
	}

	createSound(frequency, duration) {
		return function() {
			try {
				const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
				const oscillator = audioCtx.createOscillator();
				const gainNode = audioCtx.createGain();
				oscillator.connect(gainNode);
				gainNode.connect(audioCtx.destination);
				oscillator.frequency.value = frequency;
				oscillator.type = 'sine';
				gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
				oscillator.start(audioCtx.currentTime);
				oscillator.stop(audioCtx.currentTime + duration);
			} catch (e) {}
		};
	}

	toggleInstructions() {
		this.showInstructions = !this.showInstructions;
	}

	draw(context, drawinterval) {
		if (this.allLevelsComplete) {
			const winTxt = new CanvasText("YOU WIN! ALL LEVELS COMPLETE!", this.width / 2, this.height / 2, true);
			winTxt.render(context);
			return;
		}

		if (this.gameover) {
			this.gameovertxt.render(context);
			return;
		}

		if (!this.started) {
			this.starttxt.render(context);
			return;
		}

		if (this.levelComplete) {
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
			if (this.levels[this.activelevel].completed && !this.levelComplete) {
				this.levelComplete = true;
				setTimeout(() => { this.nextLevel(); }, 2000);
			}
		}

		if (!this.live && this.waitingBall) {
			this.waitingBall.render(context, drawinterval);
			context.save();
			context.globalAlpha = 0.7;
			this.nextBallTxt.render(context);
			context.restore();
		}

		for (let n = 0; n < this.balls.length; n++) {
			if (this.balls[n].active) {
				this.balls[n].render(context, drawinterval);
				this.balls[n].collideswall(this.width, this.height);

				if (this.balls[n].collides(this.paddle.box(), this.paddle.collider())) {
					this.sounds.paddle();
				}

				if (this.levels[this.activelevel]) {
					this.levels[this.activelevel].collides(this.balls[n], () => {
						this.addscore(10)();
						this.sounds.brick();
					});
				}

				if (!this.paused) {
					this.balls[n].move();
				}
			}
		}

		if (this.showInstructions) {
			context.fillStyle = "rgba(0, 0, 0, 0.8)";
			context.fillRect(this.width / 2 - 200, this.height / 2 - 150, 400, 300);
			context.fillStyle = "#FFFFFF";
			context.font = "bold 24px sans-serif";
			context.textAlign = "center";
			context.fillText("CONTROLS", this.width / 2, this.height / 2 - 110);
			context.font = "16px sans-serif";
			context.textAlign = "left";
			const instructions = [
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
			let yPos = this.height / 2 - 70;
			for (let i = 0; i < instructions.length; i++) {
				context.fillText(instructions[i], this.width / 2 - 180, yPos);
				yPos += 30;
			}
		}
	}

	startgame() {
		this.started = true;
		this.addball();
	}

	addball() {
		const newball = new Circle(this.width / 2, this.height / 2, 10, 0, 1, this.endlife());
		newball.active = false;
		this.waitingBall = newball;
		this.balls[this.ballindex++] = newball;
	}

	launchBall() {
		if (this.waitingBall) {
			this.waitingBall.active = true;
			this.live = true;
			this.waitingBall = null;
		}
	}

	pause() {
		this.paused = !this.paused;
	}

	mousemove(x) {
		if (!this.paused) {
			this.paddle.moveto(x - this.paddle.width / 2);
		}
	}

	moveleft() { this.paddle.moveleft(); }
	moveright() { this.paddle.moveright(this.width); }

	newlife() {
		if (!this.paused && !this.gameover) {
			this.addball();
		}
	}

	endlife() {
		return () => {
			this.lifecount -= 1;
			this.live = false;
			this.gameover = this.lifecount === 0;
			if (this.gameover) {
				this.sounds.gameover();
			} else {
				setTimeout(() => { this.addball(); }, 500);
			}
		};
	}

	addscore(n) {
		return () => { this.score += n; };
	}

	slow() {
		for (let n = 0; n < this.balls.length; n++) {
			if (this.balls[n].active) this.balls[n].speedfactor--;
		}
	}

	speed() {
		for (let n = 0; n < this.balls.length; n++) {
			if (this.balls[n].active) this.balls[n].speedfactor++;
		}
	}

	embiggen() {
		for (let n = 0; n < this.balls.length; n++) {
			if (this.balls[n].active) this.balls[n].r++;
		}
	}

	shrink() {
		for (let n = 0; n < this.balls.length; n++) {
			if (this.balls[n].active) this.balls[n].r--;
		}
	}

	invinsible() { this.paddle.width = this.width; }
	paddlewidth(n) { this.paddle.width = n; }
}
