/**
 * Sprite Dash - an endless runner built from the old Sprite Test sprites.
 *
 * Everything is drawn into a small low-resolution canvas (one "logical"
 * pixel per sprite pixel) and then scaled up with nearest-neighbour
 * sampling, so the pixel art stays crisp at any window size.
 */
(function() {
    'use strict';

    // ---------------------------------------------------------------
    // Sprite data (rects measured from the sheets in /assets/img)
    // ---------------------------------------------------------------

    const SHEETS = {
        mario: '/assets/img/mario3.gif',
        baddies: '/assets/img/baddies.png'
    };

    const FRAMES = {
        run: [
            { x: 162, y: 25, w: 19, h: 27 },
            { x: 186, y: 25, w: 20, h: 27 },
            { x: 221, y: 25, w: 19, h: 26 }
        ],
        jump: [{ x: 360, y: 23, w: 19, h: 27 }],
        fall: [{ x: 381, y: 23, w: 18, h: 27 }],
        duck: [{ x: 29, y: 33, w: 14, h: 17 }],
        dead: [{ x: 440, y: 26, w: 16, h: 27 }],
        shyguy: [
            { x: 81, y: 22, w: 16, h: 15 },
            { x: 111, y: 21, w: 16, h: 16 }
        ],
        spiny: [
            { x: 322, y: 21, w: 15, h: 16 },
            { x: 351, y: 21, w: 16, h: 16 }
        ],
        bird: [
            { x: 18, y: 411, w: 30, h: 16 },
            { x: 52, y: 412, w: 29, h: 14 },
            { x: 85, y: 413, w: 31, h: 11 },
            { x: 121, y: 412, w: 28, h: 13 }
        ],
        ostrich: [
            { x: 321, y: 430, w: 16, h: 32 },
            { x: 351, y: 430, w: 16, h: 32 }
        ],
        snake: [
            { x: 314, y: 330, w: 15, h: 32 },
            { x: 344, y: 330, w: 16, h: 32 }
        ]
    };

    // Shy guys come in a few colours, one per row of the sheet
    const SHYGUY_ROWS = [0, 35, 70, 105, 140];

    // ---------------------------------------------------------------
    // Tuning
    // ---------------------------------------------------------------

    const GRAVITY = 1500;
    const JUMP_VELOCITY = 340;
    const JUMP_HOLD_GRAVITY = 0.42; // gravity multiplier while jump is held
    const JUMP_HOLD_MAX = 0.28; // seconds the hold boost lasts
    const FAST_FALL = 3.2;
    const START_SPEED = 150;
    const MAX_SPEED = 560;
    const SPEED_RAMP = 70; // seconds to reach ~63% of max
    const PX_PER_METRE = 16;
    const BEST_KEY = 'spriteDash.best';

    const SKIES = [
        { top: '#5fb4ff', bottom: '#c6ecff', far: '#8fc7e8', mid: '#3aa35b', midDark: '#1f6b39', night: 0 },
        { top: '#ff8a5c', bottom: '#ffd59e', far: '#d98a8a', mid: '#4f8f45', midDark: '#2b5a2a', night: 0 },
        { top: '#1b1f4b', bottom: '#5a4b8a', far: '#3d3a6b', mid: '#24504a', midDark: '#12302c', night: 0.6 },
        { top: '#0b0f2a', bottom: '#233066', far: '#1f2a52', mid: '#1c3a3a', midDark: '#0c2020', night: 1 }
    ];
    const SKY_LENGTH = 600; // metres per sky phase

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function hexToRgb(hex) {
        const n = parseInt(hex.slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function mixColor(a, b, t) {
        const ca = hexToRgb(a);
        const cb = hexToRgb(b);
        return `rgb(${Math.round(lerp(ca[0], cb[0], t))},${Math.round(lerp(ca[1], cb[1], t))},${Math.round(lerp(ca[2], cb[2], t))})`;
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Could not load ${src}`));
            img.src = src;
        });
    }

    function readBest() {
        try {
            return parseInt(localStorage.getItem(BEST_KEY), 10) || 0;
        } catch (e) {
            return 0;
        }
    }

    function writeBest(value) {
        try {
            localStorage.setItem(BEST_KEY, String(value));
        } catch (e) {
            // Storage can be unavailable (private mode); the best score just won't persist
        }
    }

    function overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    // ---------------------------------------------------------------
    // Game
    // ---------------------------------------------------------------

    class SpriteDash {
        constructor(canvas, images) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.images = images;

            this.buffer = document.createElement('canvas');
            this.bctx = this.buffer.getContext('2d');

            this.best = readBest();
            this.state = 'title';
            this.paused = false;
            this.input = { jump: false, duck: false };
            this.lastTime = 0;

            this.resize();
            this.reset();
            this.bindInput();

            window.addEventListener('resize', () => this.resize());
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && this.state === 'playing') this.paused = true;
            });

            requestAnimationFrame((t) => this.frame(t));
        }

        resize() {
            const dpr = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.canvas.width = Math.round(width * dpr);
            this.canvas.height = Math.round(height * dpr);
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';

            // Aim for roughly 200 logical pixels of height, but keep enough
            // width on portrait phones to see obstacles coming
            const byHeight = this.canvas.height / 200;
            const byWidth = this.canvas.width / 240;
            this.scale = Math.max(1, Math.round(Math.min(byHeight, byWidth)));
            this.w = Math.ceil(this.canvas.width / this.scale);
            this.h = Math.ceil(this.canvas.height / this.scale);
            this.buffer.width = this.w;
            this.buffer.height = this.h;
            this.groundY = Math.round(this.h * (this.h > this.w ? 0.68 : 0.78));

            if (this.player && this.player.onGround) {
                this.player.y = this.groundY;
            }
        }

        reset() {
            this.time = 0;
            this.distance = 0;
            this.speed = START_SPEED;
            this.score = 0;
            this.stompPoints = 0;
            this.combo = 0;
            this.shake = 0;
            this.flash = 0;
            this.nextMilestone = 250;
            this.banner = null;
            this.deadTimer = 0;
            this.newBest = false;

            this.player = {
                x: Math.round(this.w * 0.18),
                y: this.groundY,
                vy: 0,
                onGround: true,
                ducking: false,
                holdTime: 0,
                animTime: 0,
                dustTimer: 0
            };

            this.obstacles = [];
            this.particles = [];
            this.popups = [];
            this.nextSpawn = this.w * 0.9;

            this.clouds = [];
            for (let i = 0; i < 6; i++) {
                this.clouds.push({ x: rand(0, this.w), y: rand(8, this.h * 0.35), size: rand(0.7, 1.4) });
            }

            this.streaks = [];
            for (let i = 0; i < 28; i++) {
                this.streaks.push(this.makeStreak(rand(0, this.w)));
            }
        }

        makeStreak(x) {
            return { x: x, y: rand(4, this.groundY - 4), len: rand(10, 40), speed: rand(1.4, 2.4) };
        }

        // -----------------------------------------------------------
        // Input
        // -----------------------------------------------------------

        bindInput() {
            const jumpKeys = ['Space', 'ArrowUp', 'KeyW'];
            const duckKeys = ['ArrowDown', 'KeyS'];

            window.addEventListener('keydown', (e) => {
                if (jumpKeys.includes(e.code)) {
                    e.preventDefault();
                    if (!e.repeat) this.press('jump');
                } else if (duckKeys.includes(e.code)) {
                    e.preventDefault();
                    this.press('duck');
                } else if (e.code === 'KeyP' || e.code === 'Escape') {
                    if (this.state === 'playing') this.paused = !this.paused;
                }
            });

            window.addEventListener('keyup', (e) => {
                if (jumpKeys.includes(e.code)) this.input.jump = false;
                if (duckKeys.includes(e.code)) this.input.duck = false;
            });

            // Touch / mouse: left third ducks, the rest jumps
            const pointers = new Map();
            this.canvas.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                const action = e.clientX < window.innerWidth / 3 ? 'duck' : 'jump';
                pointers.set(e.pointerId, action);
                this.press(action);
            });
            const release = (e) => {
                const action = pointers.get(e.pointerId);
                pointers.delete(e.pointerId);
                if (action && ![...pointers.values()].includes(action)) {
                    this.input[action] = false;
                }
            };
            this.canvas.addEventListener('pointerup', release);
            this.canvas.addEventListener('pointercancel', release);
            this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        }

        press(action) {
            if (this.state === 'title') {
                if (action === 'jump') this.start();
                return;
            }
            if (this.state === 'dead') {
                if (action === 'jump' && this.deadTimer > 0.6) this.start();
                return;
            }
            if (this.paused) {
                this.paused = false;
                return;
            }

            this.input[action] = true;
            if (action === 'jump' && this.player.onGround) {
                this.jump();
            }
        }

        start() {
            this.reset();
            this.state = 'playing';
            this.input.jump = false;
            this.input.duck = false;
        }

        jump() {
            const p = this.player;
            p.vy = -JUMP_VELOCITY;
            p.onGround = false;
            p.holdTime = 0;
            this.input.jump = true;
            this.puff(p.x + 4, p.y, 6, -40);
        }

        // -----------------------------------------------------------
        // Loop
        // -----------------------------------------------------------

        frame(now) {
            const dt = Math.min(0.05, (now - (this.lastTime || now)) / 1000);
            this.lastTime = now;

            if (!this.paused) this.update(dt);
            this.render();

            requestAnimationFrame((t) => this.frame(t));
        }

        update(dt) {
            this.time += dt;

            if (this.state === 'title') {
                this.speed = START_SPEED * 0.8;
                this.scroll(dt);
                this.player.animTime += dt;
                this.updateParticles(dt);
                return;
            }

            if (this.state === 'dead') {
                this.deadTimer += dt;
                const p = this.player;
                p.vy += GRAVITY * dt;
                p.y += p.vy * dt;
                this.speed = Math.max(0, this.speed - 900 * dt);
                this.scroll(dt);
                this.updateParticles(dt);
                this.shake = Math.max(0, this.shake - dt * 30);
                this.flash = Math.max(0, this.flash - dt * 3);
                return;
            }

            // Speed ramps up smoothly towards MAX_SPEED
            const t = 1 - Math.exp(-this.time / SPEED_RAMP);
            this.speed = START_SPEED + (MAX_SPEED - START_SPEED) * t;

            this.scroll(dt);
            this.distance += this.speed * dt;
            this.score = Math.floor(this.distance / PX_PER_METRE) + this.stompPoints;

            const metres = this.distance / PX_PER_METRE;
            if (metres >= this.nextMilestone) {
                this.banner = { text: `${this.nextMilestone} m`, life: 1.4 };
                this.flash = 0.35;
                this.nextMilestone += 250;
            }
            if (this.banner) {
                this.banner.life -= dt;
                if (this.banner.life <= 0) this.banner = null;
            }

            this.updatePlayer(dt);
            this.updateObstacles(dt);
            this.updateParticles(dt);

            this.shake = Math.max(0, this.shake - dt * 30);
            this.flash = Math.max(0, this.flash - dt * 3);
        }

        scroll(dt) {
            const move = this.speed * dt;

            for (const c of this.clouds) {
                c.x -= move * 0.08 * c.size;
                if (c.x < -40) {
                    c.x = this.w + rand(10, 80);
                    c.y = rand(8, this.h * 0.35);
                }
            }

            for (const s of this.streaks) {
                s.x -= move * s.speed;
                if (s.x + s.len < 0) Object.assign(s, this.makeStreak(this.w + rand(0, 60)));
            }

            this.scrollX = (this.scrollX || 0) + move;
        }

        updatePlayer(dt) {
            const p = this.player;
            p.animTime += dt * (0.6 + this.speed / 220);

            p.ducking = this.input.duck && p.onGround;

            if (!p.onGround) {
                let g = GRAVITY;
                if (this.input.jump && p.vy < 0 && p.holdTime < JUMP_HOLD_MAX) {
                    g *= JUMP_HOLD_GRAVITY;
                    p.holdTime += dt;
                }
                if (this.input.duck) g *= FAST_FALL;
                p.vy += g * dt;
                p.y += p.vy * dt;

                if (p.y >= this.groundY) {
                    p.y = this.groundY;
                    p.vy = 0;
                    p.onGround = true;
                    this.combo = 0;
                    this.puff(p.x + 8, p.y, 8, -30);
                }
            }

            if (p.onGround && !p.ducking) {
                p.dustTimer -= dt;
                if (p.dustTimer <= 0) {
                    p.dustTimer = Math.max(0.03, 0.12 - this.speed / 6000);
                    this.particles.push({
                        x: p.x + 2,
                        y: p.y - 1,
                        vx: -this.speed * rand(0.2, 0.5),
                        vy: rand(-25, -5),
                        life: 0.35,
                        max: 0.35,
                        color: '#e8d9b5',
                        size: 1 + Math.round(Math.random())
                    });
                }
            }
        }

        playerBox() {
            const p = this.player;
            const frame = this.playerFrame();
            // Forgiving hitbox: smaller than the sprite
            return {
                x: p.x + 4,
                y: p.y - frame.h + 4,
                w: frame.w - 8,
                h: frame.h - 5
            };
        }

        playerFrame() {
            const p = this.player;
            if (this.state === 'dead') return FRAMES.dead[0];
            if (p.ducking) return FRAMES.duck[0];
            if (!p.onGround) return p.vy < 0 ? FRAMES.jump[0] : FRAMES.fall[0];
            return FRAMES.run[Math.floor(p.animTime * 10) % FRAMES.run.length];
        }

        spawnObstacle() {
            const metres = this.distance / PX_PER_METRE;
            const kinds = ['shyguy', 'shyguy', 'spiny'];
            if (metres > 120) kinds.push('bird', 'bird');
            if (metres > 250) kinds.push('snake');
            if (metres > 400) kinds.push('ostrich');

            const kind = pick(kinds);
            const o = {
                kind: kind,
                x: this.w + 20,
                y: this.groundY,
                vx: 0,
                anim: 0,
                stompable: kind === 'shyguy' || kind === 'ostrich',
                squashed: false,
                row: 0
            };

            if (kind === 'shyguy') {
                o.vx = rand(20, 50);
                o.row = pick(SHYGUY_ROWS);
            } else if (kind === 'spiny') {
                o.vx = rand(10, 30);
            } else if (kind === 'bird') {
                // Low birds must be jumped, high birds must be ducked under
                o.high = Math.random() < 0.55;
                o.y = this.groundY - (o.high ? 20 : 4);
                o.vx = rand(40, 80);
                o.bob = rand(0, Math.PI * 2);
            } else if (kind === 'ostrich') {
                o.vx = rand(90, 140);
            }

            this.obstacles.push(o);

            // Gap scales with speed so there is always time to react
            const reaction = rand(0.75, 1.6);
            this.nextSpawn = this.speed * reaction + rand(30, 70);
            if (Math.random() < 0.15 && metres > 200) {
                // Occasional tight pair
                this.nextSpawn = this.speed * 0.42 + 20;
            }
        }

        updateObstacles(dt) {
            this.nextSpawn -= this.speed * dt;
            if (this.nextSpawn <= 0) this.spawnObstacle();

            const p = this.player;
            const box = this.playerBox();

            for (const o of this.obstacles) {
                o.x -= (this.speed + o.vx) * dt;
                o.anim += dt;

                if (o.squashed) {
                    o.vy += GRAVITY * dt;
                    o.y += o.vy * dt;
                    continue;
                }

                if (o.kind === 'bird') {
                    o.drawY = o.y + Math.sin(o.anim * 6 + o.bob) * 2;
                }

                const hit = this.obstacleBox(o);
                if (!overlaps(box, hit)) continue;

                const falling = p.vy > 0 && !p.onGround;
                const feet = p.y;
                if (o.stompable && falling && feet - hit.y < 10) {
                    this.stomp(o);
                } else {
                    this.die();
                    return;
                }
            }

            this.obstacles = this.obstacles.filter((o) => o.x > -60 && o.y < this.h + 60);
        }

        obstacleFrame(o) {
            const frames = FRAMES[o.kind];
            const rate = o.kind === 'bird' ? 10 : o.kind === 'ostrich' ? 12 : 6;
            const frame = frames[Math.floor(o.anim * rate) % frames.length];
            if (o.kind === 'shyguy' && o.row) {
                return { x: frame.x, y: frame.y + o.row, w: frame.w, h: frame.h };
            }
            return frame;
        }

        obstacleBox(o) {
            const f = this.obstacleFrame(o);
            const y = o.kind === 'bird' ? (o.drawY || o.y) : o.y;
            return { x: o.x + 3, y: y - f.h + 3, w: f.w - 6, h: f.h - 4 };
        }

        stomp(o) {
            const p = this.player;
            o.squashed = true;
            o.vy = -120;
            p.vy = -JUMP_VELOCITY * 0.75;
            p.holdTime = 0;
            this.combo += 1;
            const points = 50 * this.combo;
            this.stompPoints += points;
            this.popups.push({ x: o.x, y: o.y - 30, text: `+${points}`, life: 0.8 });
            this.puff(o.x + 8, o.y - 8, 10, -60);
            this.shake = 3;
        }

        die() {
            this.state = 'dead';
            this.deadTimer = 0;
            this.shake = 8;
            this.flash = 0.6;
            this.player.vy = -260;
            this.player.onGround = false;
            this.puff(this.player.x + 8, this.player.y - 12, 16, -80);

            if (this.score > this.best) {
                this.best = this.score;
                this.newBest = true;
                writeBest(this.best);
            }
        }

        puff(x, y, count, vyBase) {
            for (let i = 0; i < count; i++) {
                const life = rand(0.25, 0.5);
                this.particles.push({
                    x: x,
                    y: y,
                    vx: rand(-60, 40) - this.speed * 0.3,
                    vy: vyBase * rand(0.3, 1),
                    life: life,
                    max: life,
                    color: '#ffffff',
                    size: 1 + Math.round(Math.random())
                });
            }
        }

        updateParticles(dt) {
            for (const part of this.particles) {
                part.x += part.vx * dt;
                part.y += part.vy * dt;
                part.vy += 120 * dt;
                part.life -= dt;
            }
            this.particles = this.particles.filter((part) => part.life > 0);

            for (const pop of this.popups) {
                pop.y -= 30 * dt;
                pop.x -= this.speed * dt * 0.5;
                pop.life -= dt;
            }
            this.popups = this.popups.filter((pop) => pop.life > 0);
        }

        // -----------------------------------------------------------
        // Rendering
        // -----------------------------------------------------------

        sky() {
            const metres = this.distance / PX_PER_METRE;
            const phase = metres / SKY_LENGTH;
            const i = Math.floor(phase) % SKIES.length;
            const j = (i + 1) % SKIES.length;
            // Hold each palette, then blend over the last fifth of the phase
            const local = phase - Math.floor(phase);
            const t = Math.max(0, (local - 0.8) / 0.2);
            const a = SKIES[i];
            const b = SKIES[j];
            return {
                top: mixColor(a.top, b.top, t),
                bottom: mixColor(a.bottom, b.bottom, t),
                far: mixColor(a.far, b.far, t),
                mid: mixColor(a.mid, b.mid, t),
                midDark: mixColor(a.midDark, b.midDark, t),
                night: lerp(a.night, b.night, t)
            };
        }

        render() {
            const c = this.bctx;
            const w = this.w;
            const h = this.h;
            const sky = this.sky();
            const scroll = this.scrollX || 0;

            c.imageSmoothingEnabled = false;

            // Sky
            const grad = c.createLinearGradient(0, 0, 0, this.groundY);
            grad.addColorStop(0, sky.top);
            grad.addColorStop(1, sky.bottom);
            c.fillStyle = grad;
            c.fillRect(0, 0, w, h);

            // Stars at night
            if (sky.night > 0) {
                c.fillStyle = `rgba(255,255,255,${0.8 * sky.night})`;
                for (let i = 0; i < 40; i++) {
                    const sx = ((i * 97 + 13) % w + w - (scroll * 0.01) % w) % w;
                    const sy = (i * 53) % Math.max(1, Math.floor(this.groundY * 0.6));
                    c.fillRect(Math.floor(sx), sy, 1, 1);
                }
            }

            // Clouds
            c.fillStyle = sky.night > 0.5 ? 'rgba(200,210,255,0.25)' : 'rgba(255,255,255,0.9)';
            for (const cl of this.clouds) {
                this.drawCloud(c, Math.round(cl.x), Math.round(cl.y), cl.size);
            }

            // Far mountains
            this.drawRidge(c, scroll * 0.12, this.groundY - 46, 30, sky.far, 0.011, 0.027);

            // Mid hills
            this.drawRidge(c, scroll * 0.35, this.groundY - 18, 16, sky.mid, 0.03, 0.071);
            this.drawRidge(c, scroll * 0.35, this.groundY - 10, 10, sky.midDark, 0.045, 0.09);

            // Speed streaks get stronger as you go faster
            const streakAlpha = Math.max(0, (this.speed - 220) / (MAX_SPEED - 220));
            if (streakAlpha > 0 && this.state !== 'title') {
                c.fillStyle = `rgba(255,255,255,${0.35 * streakAlpha})`;
                const count = Math.floor(this.streaks.length * streakAlpha);
                for (let i = 0; i < count; i++) {
                    const s = this.streaks[i];
                    c.fillRect(Math.round(s.x), Math.round(s.y), Math.round(s.len * (0.5 + streakAlpha)), 1);
                }
            }

            this.drawGround(c, scroll);

            // Obstacles
            for (const o of this.obstacles) {
                const f = this.obstacleFrame(o);
                const y = o.kind === 'bird' ? (o.drawY || o.y) : o.y;
                if (o.squashed) {
                    c.save();
                    c.translate(Math.round(o.x), Math.round(y - f.h));
                    c.scale(1, -1);
                    c.drawImage(this.images.baddies, f.x, f.y, f.w, f.h, 0, -f.h, f.w, f.h);
                    c.restore();
                } else {
                    c.drawImage(this.images.baddies, f.x, f.y, f.w, f.h, Math.round(o.x), Math.round(y - f.h), f.w, f.h);
                }
            }

            // Player (with a short motion trail at high speed)
            const p = this.player;
            const pf = this.playerFrame();
            if (this.state === 'playing' && this.speed > 300) {
                const trail = Math.min(0.35, (this.speed - 300) / 600);
                c.globalAlpha = trail;
                c.drawImage(this.images.mario, pf.x, pf.y, pf.w, pf.h, Math.round(p.x - 5), Math.round(p.y - pf.h), pf.w, pf.h);
                c.globalAlpha = trail * 0.5;
                c.drawImage(this.images.mario, pf.x, pf.y, pf.w, pf.h, Math.round(p.x - 10), Math.round(p.y - pf.h), pf.w, pf.h);
                c.globalAlpha = 1;
            }
            c.drawImage(this.images.mario, pf.x, pf.y, pf.w, pf.h, Math.round(p.x), Math.round(p.y - pf.h), pf.w, pf.h);

            // Particles
            for (const part of this.particles) {
                c.globalAlpha = Math.max(0, part.life / part.max);
                c.fillStyle = part.color;
                c.fillRect(Math.round(part.x), Math.round(part.y), part.size, part.size);
            }
            c.globalAlpha = 1;

            // Scale the buffer up to the screen
            const ctx = this.ctx;
            ctx.imageSmoothingEnabled = false;
            ctx.save();
            if (this.shake > 0) {
                ctx.translate(rand(-1, 1) * this.shake * this.scale * 0.5, rand(-1, 1) * this.shake * this.scale * 0.5);
            }
            ctx.drawImage(this.buffer, 0, 0, w * this.scale, h * this.scale);
            ctx.restore();

            if (this.flash > 0) {
                ctx.fillStyle = `rgba(255,255,255,${this.flash * 0.5})`;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            this.drawHud(ctx);
        }

        drawCloud(c, x, y, size) {
            const s = size;
            const blobs = [[0, 4, 6], [6, 0, 8], [14, 3, 7], [20, 6, 5]];
            for (const [bx, by, r] of blobs) {
                c.beginPath();
                c.arc(x + bx * s, y + by * s, r * s, 0, Math.PI * 2);
                c.fill();
            }
            c.fillRect(x - 4 * s, y + 4 * s, 28 * s, 6 * s);
        }

        drawRidge(c, offset, baseY, amp, color, f1, f2) {
            c.fillStyle = color;
            c.beginPath();
            c.moveTo(0, this.groundY);
            for (let x = 0; x <= this.w + 2; x += 2) {
                const wx = x + offset;
                const y = baseY - amp * (0.5 + 0.3 * Math.sin(wx * f1) + 0.2 * Math.sin(wx * f2 + 1.7));
                c.lineTo(x, Math.round(y));
            }
            c.lineTo(this.w, this.groundY);
            c.closePath();
            c.fill();
        }

        drawGround(c, scroll) {
            const gy = this.groundY;
            const tile = 16;
            const off = Math.floor(scroll) % tile;

            c.fillStyle = '#c97b3a';
            c.fillRect(0, gy, this.w, this.h - gy);

            // Grass lip
            c.fillStyle = '#5ad15a';
            c.fillRect(0, gy, this.w, 3);
            c.fillStyle = '#2f8f3a';
            c.fillRect(0, gy + 3, this.w, 1);

            // Brick seams scroll with the world, which sells the speed
            c.fillStyle = '#8a4b1f';
            for (let x = -off; x < this.w + tile; x += tile) {
                for (let row = 0; gy + 4 + row * 8 < this.h; row++) {
                    const shift = row % 2 === 0 ? 0 : tile / 2;
                    const yy = gy + 4 + row * 8;
                    c.fillRect(x + shift, yy, 1, 8);
                    c.fillRect(x, yy + 7, tile, 1);
                }
            }

            // Fast foreground grass tufts
            const fgOff = Math.floor(scroll * 1.4) % 37;
            c.fillStyle = '#3fbf4a';
            for (let x = -fgOff; x < this.w + 37; x += 37) {
                c.fillRect(x, gy - 2, 1, 2);
                c.fillRect(x + 2, gy - 3, 1, 3);
                c.fillRect(x + 4, gy - 2, 1, 2);
            }
        }

        drawHud(ctx) {
            const s = this.scale;
            const W = this.canvas.width;
            const H = this.canvas.height;
            const font = (size) => `${Math.round(size)}px "Press Start 2P", "Roboto Mono", monospace`;
            const unit = Math.max(12, Math.round(Math.min(W / 34, H / 22)));

            ctx.textBaseline = 'top';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowOffsetX = Math.round(s / 2);
            ctx.shadowOffsetY = Math.round(s / 2);
            ctx.shadowBlur = 0;

            if (this.state !== 'title') {
                ctx.font = font(unit);
                ctx.textAlign = 'right';
                ctx.fillText(String(this.score).padStart(6, '0'), W - unit * 1.5, unit * 1.5);
                ctx.font = font(unit * 0.6);
                ctx.fillText(`BEST ${String(this.best).padStart(6, '0')}`, W - unit * 1.5, unit * 3);
                ctx.textAlign = 'left';
                const kmh = Math.round(this.speed / PX_PER_METRE * 3.6);
                ctx.fillText(`${kmh} KM/H`, unit * 1.5, H - unit * 2);
            }

            ctx.textAlign = 'center';

            if (this.banner) {
                ctx.font = font(unit * 1.4);
                ctx.globalAlpha = Math.min(1, this.banner.life * 2);
                ctx.fillText(this.banner.text, W / 2, H * 0.22);
                ctx.globalAlpha = 1;
            }

            for (const pop of this.popups) {
                ctx.font = font(unit * 0.7);
                ctx.globalAlpha = Math.min(1, pop.life * 2);
                ctx.fillText(pop.text, pop.x * s, pop.y * s);
                ctx.globalAlpha = 1;
            }

            const touch = window.matchMedia('(pointer: coarse)').matches;

            // Draw centred lines of [text, size] that shrink to fit narrow screens
            const lines = (top, rows) => {
                let y = top;
                for (const [text, size] of rows) {
                    if (text) {
                        ctx.font = font(size);
                        const fit = Math.min(1, (W * 0.92) / ctx.measureText(text).width);
                        if (fit < 1) ctx.font = font(size * fit);
                        ctx.fillText(text, W / 2, y);
                    }
                    y += size * 1.7;
                }
            };
            const blink = Math.floor(this.time * 2) % 2 === 0;

            if (this.state === 'title') {
                lines(H * 0.18, [
                    ['SPRITE DASH', unit * 2.2],
                    ['', unit * 0.5],
                    [touch ? 'TAP THE RIGHT SIDE TO JUMP' : 'SPACE OR \u2191 TO JUMP, HOLD FOR HIGHER', unit * 0.7],
                    [touch ? 'HOLD THE LEFT SIDE TO DUCK' : '\u2193 TO DUCK OR DROP FAST', unit * 0.7],
                    ['STOMP SHY GUYS AND OSTRICHES', unit * 0.7],
                    ['', unit * 0.5],
                    [blink ? (touch ? 'TAP TO START' : 'PRESS SPACE TO START') : '', unit],
                    [this.best ? `BEST ${this.best}` : '', unit * 0.6]
                ]);
            } else if (this.state === 'dead' && this.deadTimer > 0.4) {
                const metres = Math.floor(this.distance / PX_PER_METRE);
                lines(H * 0.2, [
                    ['WIPEOUT', unit * 1.8],
                    [`${metres} M \u00b7 SCORE ${this.score}`, unit * 0.8],
                    [this.newBest ? 'NEW BEST!' : '', unit * 0.8],
                    [this.deadTimer > 0.6 ? (touch ? 'TAP TO RUN AGAIN' : 'SPACE TO RUN AGAIN') : '', unit * 0.8]
                ]);
            } else if (this.paused) {
                lines(H * 0.3, [
                    ['PAUSED', unit * 1.6],
                    [touch ? 'TAP TO RESUME' : 'PRESS P OR SPACE', unit * 0.7]
                ]);
            }

            ctx.shadowColor = 'transparent';
            ctx.textAlign = 'left';
        }
    }

    async function init() {
        const canvas = document.getElementById('dash-canvas');
        if (!canvas) return;
        try {
            const [mario, baddies] = await Promise.all([loadImage(SHEETS.mario), loadImage(SHEETS.baddies)]);
            if (document.fonts && document.fonts.load) {
                // Don't let a slow font hold up the game
                const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
                await Promise.race([document.fonts.load('16px "Press Start 2P"'), timeout]).catch(() => {});
            }
            window.spriteDash = new SpriteDash(canvas, { mario: mario, baddies: baddies });
        } catch (error) {
            console.error('Sprite Dash failed to start:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
