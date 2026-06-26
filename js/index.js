/**
 * 💙 Birthday Surprise — Ultra Premium "Ocean Blue & Starlight Gold" JS 💙
 * Fully Responsive, Touch & Pointer Enabled, Canvas Particle Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── State Management ───────────────────────────────────────────────── */
    const state = {
        current: 0,
        envelopeOpen: false,
        diaryOpen: false,
        cakeCut: false,
        giftOpen: false,
        audio: null
    };
    const TOTAL = 6;

    /* ─── Sections & Dots Progress ────────────────────────────────────────── */
    const sections = Array.from(document.querySelectorAll('.section'));
    const dots = Array.from(document.querySelectorAll('.dot'));

    const goTo = (idx) => {
        if (idx < 0 || idx >= TOTAL) return;
        sections[state.current]?.classList.remove('active');
        dots[state.current]?.classList.remove('active');
        state.current = idx;
        sections[idx]?.classList.add('active');
        dots[idx]?.classList.add('active');

        // Scroll section back to top on navigate
        sections[idx]?.scrollTo({ top: 0, behavior: 'instant' });

        if (idx === 2) initPolaroidStack();
    };

    dots.forEach(dot => dot.addEventListener('click', () => {
        // Prevent skipped navigation if prior interactive elements are untouched
        if (dot.dataset.section > 0 && !state.envelopeOpen) return;
        goTo(+dot.dataset.section);
    }));

    /* ─── High Performance Canvas Spark & Particle Engine ─────────────────── */
    const canvas = document.getElementById('canvas-sparks');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let bgParticles = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y, color, type = 'spark') {
            this.x = x;
            this.y = y;
            this.color = color;
            this.type = type; // 'spark', 'heart', 'star', 'confetti'
            this.size = type === 'heart' || type === 'star' ? 10 + Math.random() * 12 : 3 + Math.random() * 6;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = type === 'confetti' ? 3 + Math.random() * 6 : 4 + Math.random() * 8;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed - (type === 'confetti' ? 2 : 0);
            this.alpha = 1;
            this.decay = 0.015 + Math.random() * 0.02;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;

            if (this.type === 'heart') {
                ctx.beginPath();
                const s = this.size;
                ctx.moveTo(0, -s / 2);
                ctx.bezierCurveTo(s, -s * 1.5, s * 1.5, s / 3, 0, s);
                ctx.bezierCurveTo(-s * 1.5, s / 3, -s, -s * 1.5, 0, -s / 2);
                ctx.fill();
            } else if (this.type === 'star') {
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * this.size, Math.sin(((18 + i * 72) * Math.PI) / 180) * this.size);
                    ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (this.size / 2), Math.sin(((54 + i * 72) * Math.PI) / 180) * (this.size / 2));
                }
                ctx.closePath();
                ctx.fill();
            } else if (this.type === 'confetti') {
                ctx.fillRect(-this.size, -this.size / 2, this.size * 2, this.size);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.type === 'confetti') {
                this.vy += 0.15; // Gravity for confetti
            }
            this.alpha -= this.decay;
            this.rotation += this.rotSpeed;
        }
    }

    class BGParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.size = 8 + Math.random() * 12;
            this.speed = 0.5 + Math.random() * 1.2;
            this.drift = (Math.random() - 0.5) * 0.4;
            this.alpha = 0.15 + Math.random() * 0.25;
            this.color = ['#b3d4ff', '#6eb8ff', '#d6eaff', '#3385ff'][Math.floor(Math.random() * 4)];
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            const s = this.size;
            ctx.moveTo(0, -s / 2);
            ctx.bezierCurveTo(s, -s * 1.5, s * 1.5, s / 3, 0, s);
            ctx.bezierCurveTo(-s * 1.5, s / 3, -s, -s * 1.5, 0, -s / 2);
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.y -= this.speed;
            this.x += this.drift;
            if (this.y < -50) {
                this.y = canvas.height + 50;
                this.x = Math.random() * canvas.width;
            }
        }
    }

    // Populate smooth floating background particles
    for (let i = 0; i < 20; i++) {
        bgParticles.push(new BGParticle());
    }

    const triggerBurst = (x, y, count = 30, type = 'spark') => {
        const colors = ['#3385ff', '#6eb8ff', '#b3d4ff', '#ffeb99', '#ffffff'];
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color, type));
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update slow floating bg
        bgParticles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw and update active explosion bursts
        particles = particles.filter(p => {
            p.update();
            p.draw();
            return p.alpha > 0;
        });

        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    /* ─── Section 0: Invitation Envelope ──────────────────────────────────── */
    const envelopeSeal = document.getElementById('envelope-seal');
    const envelope = document.getElementById('envelope');
    const envelopeHint = document.getElementById('envelope-hint');
    const btnOpenIntro = document.getElementById('btn-open-intro');

    const crackSeal = (e) => {
        if (state.envelopeOpen) return;
        state.envelopeOpen = true;

        // Visual feedback & explosion
        const rect = envelopeSeal.getBoundingClientRect();
        triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45, 'star');

        envelope.classList.add('open');
        envelopeHint.textContent = "Terbuka! Tekan tombol di surat... ✨";
        envelopeHint.style.animation = 'none';

        // Play gentle introductory sound context
        playMusic();

        // Dynamically slide up the letter with a perfect transition delay
        setTimeout(() => {
            const letter = document.getElementById('envelope-letter');
            if (letter) {
                letter.style.display = 'flex';
                // Trigger a tiny reflow so the browser parses the display state change before starting transition
                void letter.offsetHeight;

                letter.style.opacity = '1';
                letter.style.visibility = 'visible';
                if (window.innerWidth <= 480) {
                    letter.style.transform = 'translateY(-110px) scale(1.03) translateZ(15px)';
                } else {
                    letter.style.transform = 'translateY(-160px) scale(1.05) translateZ(15px)';
                }
            }
        }, 900);
    };

    envelopeSeal.addEventListener('click', crackSeal);
    envelopeSeal.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); crackSeal(); }
    });

    btnOpenIntro.addEventListener('click', () => {
        triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 50, 'heart');
        goTo(1);
    });

    /* ─── Section 1: Secret Diary with Mechanical Gold Lock ───────────────── */
    const diaryScene = document.getElementById('diary-scene');
    const diary = document.getElementById('diary');
    const btnDiaryNext = document.getElementById('btn-diary-next');
    const diaryLock = document.getElementById('diary-lock');
    const diaryTapHint = document.getElementById('diary-tap-hint');

    const openDiary = () => {
        if (state.diaryOpen) return;
        state.diaryOpen = true;

        // Unlock rotation key effect
        diaryLock.style.transform = 'rotate(90deg) scale(1.1)';
        const rect = diaryLock.getBoundingClientRect();
        triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25, 'spark');

        setTimeout(() => {
            diary.classList.add('open');
            diaryTapHint.textContent = "Opened ♥";

            setTimeout(() => {
                btnDiaryNext.classList.remove('btn--hidden');
                btnDiaryNext.classList.add('btn--visible');
            }, 1200);
        }, 600);
    };

    diaryScene.addEventListener('click', openDiary);
    diaryScene.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDiary(); }
    });

    btnDiaryNext.addEventListener('click', () => {
        goTo(2);
    });

    /* ─── Section 2: Tossable Polaroid Stack ──────────────────────────────── */
    const polaroidStack = document.getElementById('polaroid-stack');
    let polaroidsLoaded = false;

    const initPolaroidStack = () => {
        if (polaroidsLoaded) return;
        polaroidsLoaded = true;

        const images = [
            { src: 'assets/irl-01.jpeg', label: '✨' },
            { src: 'assets/irl-02.jpeg', label: '😊' },
            { src: 'assets/irl-03.jpeg', label: '🩷' },
            { src: 'assets/irl-04.jpeg', label: '🧸' },
            { src: 'assets/irl-05.jpeg', label: '☕' },
            { src: 'assets/irl-06.jpeg', label: '🤪' },
            { src: 'assets/irl-07.jpeg', label: '🤪' },
            { src: 'assets/irl-08.jpeg', label: '🤪' },
            { src: 'assets/irl-09.jpeg', label: '🤪' },
            { src: 'assets/irl-10.jpeg', label: '🤪' },
            { src: 'assets/irl-11.jpeg', label: '🤪' },
        ];

        images.forEach((img, idx) => {
            const card = document.createElement('div');
            card.className = 'polaroid';
            // Custom initial staggered rotations & stack indexes
            const rot = (idx % 2 === 0 ? -1 : 1) * (Math.random() * 5 + 2);
            card.style.transform = `rotate(${rot}deg) scale(${1 - (images.length - 1 - idx) * 0.02}) translateY(${(images.length - 1 - idx) * -5}px)`;
            card.style.zIndex = idx;

            card.innerHTML = `
                <img src="${img.src}" alt="${img.label}">
                <p class="polaroid-caption">${img.label}</p>
            `;

            polaroidStack.appendChild(card);
            setupDragAndToss(card);
        });
    };

    const setupDragAndToss = (card) => {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        const onPointerDown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            card.style.transition = 'none';
            card.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            // Rotate based on horizontal drag offset
            const rotate = currentX * 0.08;
            card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg) scale(1.05)`;
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            card.releasePointerCapture(e.pointerId);

            // If thrown past threshold, toss it out!
            if (Math.abs(currentX) > 110) {
                const tossDirection = currentX > 0 ? 1 : -1;
                card.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
                card.style.transform = `translate(${tossDirection * window.innerWidth}px, ${currentY}px) rotate(${tossDirection * 45}deg)`;
                card.style.opacity = '0';

                // Particle trail on toss
                const rect = card.getBoundingClientRect();
                triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, 'heart');

                setTimeout(() => {
                    // Send to the bottom of the stack
                    polaroidStack.insertBefore(card, polaroidStack.firstChild);
                    card.style.transition = 'none';
                    card.style.opacity = '1';

                    // Re-calculate stack scales and offsets
                    const cards = Array.from(polaroidStack.querySelectorAll('.polaroid'));
                    cards.forEach((c, idx) => {
                        const rot = (idx % 2 === 0 ? -1 : 1) * (Math.random() * 5 + 1);
                        c.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        c.style.transform = `rotate(${rot}deg) scale(${1 - (cards.length - 1 - idx) * 0.02}) translateY(${(cards.length - 1 - idx) * -5}px)`;
                        c.style.zIndex = idx;
                    });
                }, 550);
            } else {
                // Snap back to original stack position
                card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                const idx = Array.from(polaroidStack.children).indexOf(card);
                const rot = (idx % 2 === 0 ? -1 : 1) * (Math.random() * 4 + 1);
                card.style.transform = `rotate(${rot}deg) scale(${1 - (polaroidStack.children.length - 1 - idx) * 0.02}) translateY(${(polaroidStack.children.length - 1 - idx) * -5}px)`;
            }
            currentX = 0;
            currentY = 0;
        };

        card.addEventListener('pointerdown', onPointerDown);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerup', onPointerUp);
        card.addEventListener('pointercancel', onPointerUp);
    };

    document.getElementById('btn-gallery-next').addEventListener('click', () => {
        goTo(3);
    });

    /* ─── Section 3: Magical Cake cutting ─────────────────────────────────── */
    const cutZone = document.getElementById('cut-zone');
    const cutBar = document.getElementById('cut-progress-bar');
    const cutHint = document.getElementById('cut-hint');
    const cakeSvg = document.getElementById('cake-svg');
    const cakeTitle = document.getElementById('cake-title');
    const cakeSub = document.getElementById('cake-subtitle');
    const btnCakeNext = document.getElementById('btn-cake-next');
    const cutLine = document.getElementById('cut-line');
    const cakeSlice = document.getElementById('cake-slice');
    const knifeWand = document.getElementById('knife-wand');

    let isCutting = false;
    let cutStartX = 0;

    const startCut = (e) => {
        if (state.cakeCut) return;
        isCutting = true;
        cutStartX = e.touches ? e.touches[0].clientX : e.clientX;
        cutLine.style.opacity = '0.9';

        // Position knife wand
        const bounds = cutZone.getBoundingClientRect();
        knifeWand.style.opacity = '1';
    };

    const moveCut = (e) => {
        if (!isCutting || state.cakeCut) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const zoneBounds = cutZone.getBoundingClientRect();
        const diff = clientX - cutStartX;
        const progress = Math.max(0, Math.min(diff / zoneBounds.width, 1));

        cutBar.style.width = `${progress * 100}%`;

        // Interactive knife wand tracking
        const containerBounds = document.getElementById('cake-svg-container').getBoundingClientRect();
        const relativeX = clientX - containerBounds.left;
        const relativeY = clientY - containerBounds.top - 20;
        knifeWand.style.left = `${relativeX}px`;
        knifeWand.style.top = `${relativeY}px`;

        // SVG cut-line updating
        const svgX = 30 + progress * 240;
        cutLine.setAttribute('x1', '150');
        cutLine.setAttribute('y1', '40');
        cutLine.setAttribute('x2', '150');
        cutLine.setAttribute('y2', String(55 + progress * 200));

        // Shake cake
        cakeSvg.style.transform = `translateX(${(Math.random() - 0.5) * progress * 8}px)`;

        // Visual spark tail on slice cutting
        if (Math.random() > 0.4) {
            triggerBurst(clientX, clientY, 3, 'spark');
        }

        if (progress >= 0.95) finishCut(clientX, clientY);
    };

    const endCut = () => {
        isDragging = false;
        isCutting = false;
        knifeWand.style.opacity = '0';
    };

    const finishCut = (clientX, clientY) => {
        if (state.cakeCut) return;
        state.cakeCut = true;
        isCutting = false;
        knifeWand.style.opacity = '0';

        cutBar.style.width = '100%';
        cutHint.style.opacity = '0';

        // Blow out flames with beautiful particles
        document.querySelectorAll('.flame').forEach(f => {
            f.style.transition = 'opacity 0.6s';
            f.style.opacity = '0';
            const fRect = f.getBoundingClientRect();
            triggerBurst(fRect.left + fRect.width / 2, fRect.top + fRect.height / 2, 15, 'star');
        });

        // Slice slide out
        cakeSlice.style.transition = 'opacity 0.8s ease, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cakeSlice.style.opacity = '1';
        cakeSlice.style.transform = 'translate(16px, 6px) rotate(3deg)';

        cakeSvg.style.transform = 'scale(1.05)';

        // Massive spark burst
        triggerBurst(clientX, clientY, 55, 'star');

        setTimeout(() => {
            cakeTitle.textContent = 'Yummy! Buat permohonan...';
            cakeSub.textContent = 'Lilinnya sudah padam ditiup cinta! ✨';
            btnCakeNext.classList.remove('btn--hidden');
            btnCakeNext.classList.add('btn--visible');
        }, 800);
    };

    cutZone.addEventListener('mousedown', startCut, { passive: true });
    cutZone.addEventListener('touchstart', startCut, { passive: true });
    window.addEventListener('mousemove', moveCut, { passive: true });
    window.addEventListener('touchmove', moveCut, { passive: true });
    window.addEventListener('mouseup', endCut);
    window.addEventListener('touchend', endCut);

    btnCakeNext.addEventListener('click', () => {
        goTo(4);
    });

    /* ─── Music Player ────────────────────────────────────────────────────── */
    const playMusic = () => {
        if (state.audio) return;
        try {
            state.audio = new Audio('assets/music2.mp3');
            state.audio.loop = true;
            state.audio.volume = 0.5;
            state.audio.play().catch(() => { });
        } catch (e) { }
    };

    /* ─── Section 4: 3D Iridescent Soap-Bubbles Wishes ────────────────────── */
    const wishPopup = document.getElementById('wish-popup');
    const wishText = document.getElementById('wish-popup-text');
    let popupTimer = null;

    document.querySelectorAll('.wish-bubble').forEach(bubble => {
        const popBubble = (e) => {
            if (bubble.style.opacity === '0') return;

            // Play pop explosion at center of clicked bubble
            const bRect = bubble.getBoundingClientRect();
            triggerBurst(bRect.left + bRect.width / 2, bRect.top + bRect.height / 2, 24, 'heart');

            // Hide bubble
            bubble.style.transition = 'transform 0.2s, opacity 0.2s';
            bubble.style.transform = 'scale(0)';
            bubble.style.opacity = '0';
            bubble.style.pointerEvents = 'none';

            // Show popup with heartfelt message
            wishText.textContent = bubble.dataset.msg || '';
            wishPopup.classList.add('show');

            clearTimeout(popupTimer);
            popupTimer = setTimeout(() => {
                wishPopup.classList.remove('show');
            }, 3500);
        };

        bubble.addEventListener('click', popBubble);
        bubble.addEventListener('touchstart', popBubble, { passive: true });
    });

    document.getElementById('btn-to-gift').addEventListener('click', () => {
        goTo(5);
    });

    /* ─── Section 5: Premium Gift Box & 3D Tilt ───────────────────────────── */
    const giftWrap = document.getElementById('gift-box-wrap');
    const giftLid = document.getElementById('gift-lid-group');
    const giftReveal = document.getElementById('gift-reveal');
    const giftTitle = document.getElementById('gift-title');
    const rewardFrameTilt = document.getElementById('reward-frame-tilt');

    const openGift = () => {
        if (state.giftOpen) return;
        state.giftOpen = true;

        // Fly lid off
        giftLid.classList.add('open');

        // Confetti burst explosion
        const gRect = giftWrap.getBoundingClientRect();
        triggerBurst(gRect.left + gRect.width / 2, gRect.top, 65, 'confetti');

        setTimeout(() => {
            giftTitle.textContent = 'Surprise! ✨';
            giftReveal.classList.add('show');
            setup3DTilt();
        }, 800);
    };

    giftWrap.addEventListener('click', openGift);
    giftWrap.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); }
    });

    // 3D Parallax Tilt Effect on revealed reward photo
    const setup3DTilt = () => {
        rewardFrameTilt.addEventListener('mousemove', (e) => {
            const rect = rewardFrameTilt.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate tilt percentages (-15deg to 15deg)
            const rotX = -((y / rect.height) - 0.5) * 30;
            const rotY = ((x / rect.width) - 0.5) * 30;

            const card = rewardFrameTilt.querySelector('.reward-frame');
            card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06)`;
        });

        rewardFrameTilt.addEventListener('mouseleave', () => {
            const card = rewardFrameTilt.querySelector('.reward-frame');
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    };

    /* ─── Initializer ─────────────────────────────────────────────────────── */
    goTo(0);
});
