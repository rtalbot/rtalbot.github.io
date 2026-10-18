(function() {
	'use strict';

	/**
	 * Attach a pixel noise animation to a canvas element.
	 * @param {HTMLCanvasElement} element - The canvas element to animate.
	 * @param {object} options - Configuration options (can be changed later with set()).
	 * @param {boolean} [options.fullscreen=false] - Size the canvas to its CSS box.
	 * @param {number} [options.r=255] - Red channel maximum (0–255).
	 * @param {number} [options.g=255] - Green channel maximum (0–255).
	 * @param {number} [options.b=255] - Blue channel maximum (0–255).
	 * @param {number} [options.alpha=1] - Maximum opacity (0–1).
	 * @param {number} [options.size=10] - Pixel cell size in px.
	 * @param {number} [options.rate=600] - Cells repainted per second.
	 * @param {number} [options.fade=0] - Fade the whole canvas towards black each frame (0–1).
	 * @returns {{set: Function, pause: Function, resume: Function, clear: Function, toggle: Function, running: Function}}
	 */
	window.pixelNoise = function(element, options) {
		const settings = Object.assign({
			fullscreen: false,
			r: 255,
			g: 255,
			b: 255,
			alpha: 1,
			size: 10,
			rate: 600,
			fade: 0
		}, options);

		const ctx = element.getContext('2d');
		let cols = 0;
		let rows = 0;
		let running = true;
		let last = 0;
		let carry = 0;
		let frameId = null;

		function randomColor() {
			const r = Math.floor(Math.random() * (settings.r + 1));
			const g = Math.floor(Math.random() * (settings.g + 1));
			const b = Math.floor(Math.random() * (settings.b + 1));
			// Keep cells mostly visible so the canvas never goes muddy
			const a = settings.alpha * (0.5 + Math.random() * 0.5);
			return `rgba(${r},${g},${b},${a.toFixed(3)})`;
		}

		function paintCell(col, row) {
			const s = settings.size;
			ctx.clearRect(col * s, row * s, s, s);
			ctx.fillStyle = randomColor();
			ctx.fillRect(col * s, row * s, s, s);
		}

		function fill() {
			ctx.clearRect(0, 0, element.width, element.height);
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					paintCell(col, row);
				}
			}
		}

		function layout() {
			if (settings.fullscreen) {
				const dpr = window.devicePixelRatio || 1;
				const rect = element.getBoundingClientRect();
				element.width = Math.max(1, Math.round(rect.width * dpr));
				element.height = Math.max(1, Math.round(rect.height * dpr));
			}
			cols = Math.ceil(element.width / settings.size);
			rows = Math.ceil(element.height / settings.size);
			fill();
		}

		function tick(now) {
			frameId = null;
			if (!running) return;

			const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
			last = now;

			if (settings.fade > 0) {
				ctx.fillStyle = `rgba(0,0,0,${settings.fade * dt * 4})`;
				ctx.fillRect(0, 0, element.width, element.height);
			}

			carry += settings.rate * dt;
			const count = Math.floor(carry);
			carry -= count;
			const total = cols * rows;
			for (let i = 0; i < count; i++) {
				const k = Math.floor(Math.random() * total);
				paintCell(k % cols, Math.floor(k / cols));
			}

			frameId = requestAnimationFrame(tick);
		}

		function start() {
			if (frameId === null) frameId = requestAnimationFrame(tick);
		}

		if (settings.fullscreen) {
			window.addEventListener('resize', layout);
		}

		// Respect reduced motion: draw one frame and wait to be resumed
		const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		layout();
		if (reduced) {
			running = false;
		} else {
			start();
		}

		return {
			set(changes) {
				const relayout = 'size' in changes && changes.size !== settings.size;
				Object.assign(settings, changes);
				if (relayout) layout();
			},
			pause() {
				running = false;
			},
			resume() {
				running = true;
				last = 0;
				start();
			},
			toggle() {
				if (running) this.pause();
				else this.resume();
				return running;
			},
			running() {
				return running;
			},
			clear() {
				fill();
			}
		};
	};
})();
