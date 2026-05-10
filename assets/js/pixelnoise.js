(function() {
	'use strict';

	class Color {
		constructor(rval, gval, bval, alpha) {
			this.r = rval;
			this.g = gval;
			this.b = bval;
			this.alpha = alpha;
		}

		torgb() {
			const red = randomize(this.r);
			const blue = randomize(this.b);
			const green = randomize(this.g);
			let transparency = randomize(this.alpha);
			if (transparency === 0) transparency += 127;
			return `rgba(${red},${green},${blue},${transparency})`;
		}
	}

	class Cell {
		constructor(x, y, s, rval, gval, bval, alpha) {
			this.x = x;
			this.y = y;
			this.s = s;
			this.color = new Color(rval, gval, bval, alpha);
			this.active = true;
		}

		setcolor(rval, gval, bval, alpha) {
			this.color = new Color(rval, gval, bval, alpha);
		}

		draw(context, fill) {
			context.fillStyle = this.color.torgb();
			context.clearRect(this.x, this.y, this.s, this.s);
			if (fill) {
				context.fillRect(this.x, this.y, this.s, this.s);
			} else {
				context.strokeRect(this.x, this.y, this.s, this.s);
			}
		}
	}

	function randomize(c) {
		return Math.floor(Math.random() * c);
	}

	/**
	 * Attach a pixel noise animation to a canvas element.
	 * @param {HTMLCanvasElement} element - The canvas element to animate.
	 * @param {object} options - Configuration options.
	 * @param {boolean} [options.fullscreen=false] - Expand canvas to fill the window.
	 * @param {number} [options.r=256] - Red channel maximum (0–256).
	 * @param {number} [options.g=256] - Green channel maximum (0–256).
	 * @param {number} [options.b=256] - Blue channel maximum (0–256).
	 * @param {number} [options.alpha=256] - Alpha channel maximum (0–256).
	 * @param {number} [options.size=10] - Pixel cell size in px.
	 * @param {number} [options.interval=10] - Animation interval in ms.
	 * @param {number} [options.updatecells=5] - Cells updated per interval.
	 * @param {number} [options.startcell=0] - Starting cell offset.
	 * @param {number} [options.stepcell=7] - Cell offset step per interval.
	 */
	window.pixelNoise = function(element, options) {
		const settings = Object.assign({
			fullscreen: false,
			r: 256,
			b: 256,
			g: 256,
			alpha: 256,
			size: 10,
			interval: 10,
			updatecells: 5,
			startcell: 0,
			stepcell: 7
		}, options);

		const ctx = element.getContext('2d');

		if (settings.fullscreen) {
			ctx.canvas.height = window.innerHeight;
			ctx.canvas.width = window.innerWidth;
		}

		const HEIGHT = ctx.canvas.height;
		const WIDTH = ctx.canvas.width;

		const sp = settings.size;
		const xc = Math.floor(WIDTH / sp);
		const yc = Math.floor(HEIGHT / sp);
		const v = xc * yc;

		const grid = [];

		for (let row = 0; row <= yc; row++) {
			for (let col = 0; col <= xc; col++) {
				grid.push(new Cell(col * sp, row * sp, sp, settings.r, settings.b, settings.g, settings.alpha));
			}
		}

		grid.forEach(function(c) {
			c.draw(ctx, true);
		});

		const timerinterval = settings.interval;
		let offset = settings.startcell;
		const u = settings.updatecells;

		function draw() {
			offset += settings.stepcell;
			for (let i = 0; i < u; i++) {
				let k = offset + (((i % 2 === 0) ? -1 : 1) * Math.floor(Math.random() * v));
				if (k < 0) k = v - k;
				if (k > v) k = 0 + (k - v);
				const c = grid[k];
				c.active = true;
				c.draw(ctx, true);
			}
			if (offset >= v) offset = 0;
		}

		setInterval(draw, timerinterval);
	};
})();
