import { animate, scroll, inView, stagger } from "motion";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Vanilla Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Setup
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. Hero Initial Entrance Animations (Framer Motion equivalent)
    animate(
        ".motion-nav-item",
        { opacity: [0, 1], y: [-20, 0] },
        { duration: 0.8, delay: stagger(0.1) }
    );

    // The new canvas hero manages its own text fades via scroll.
    // 4. Hero Apple-styled Canvas Scrubbing Sequence
    const heroSeq = document.querySelector('.hero-sequence');
    if (heroSeq) {
        const canvas = document.getElementById("hero-canvas");
        const context = canvas.getContext("2d");
        const heroSteps = document.querySelectorAll('.hero-step');

        const frameCount = 240;
        const currentFrame = index => (
            `assets/images/herosection/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.png`
        );

        const images = [];
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        const updateImage = index => {
            if (images[index] && images[index].complete) {
                const img = images[index];
                const cw = canvas.width;
                const ch = canvas.height;
                const imgRatio = img.naturalWidth / img.naturalHeight;
                const canvasRatio = cw / ch;

                let drawW, drawH, drawX, drawY;

                if (imgRatio > canvasRatio) {
                    // Image is wider than canvas -> match height, crop width
                    drawH = ch;
                    drawW = img.naturalWidth * (ch / img.naturalHeight);
                    drawX = (cw - drawW) / 2;
                    drawY = 0;
                } else {
                    // Image is taller than canvas -> match width, crop height
                    drawW = cw;
                    drawH = img.naturalHeight * (cw / img.naturalWidth);
                    drawX = 0;
                    drawY = (ch - drawH) / 2;
                }

                // Use high-quality image smoothing
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'high';

                context.clearRect(0, 0, cw, ch);
                context.drawImage(img, drawX, drawY, drawW, drawH);
            } else {
                images[index].onload = () => updateImage(index);
            }
        };

        const initCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            updateImage(0);
        };
        
        if (images[0].complete) {
            initCanvas();
        } else {
            images[0].onload = initCanvas;
        }

        window.addEventListener('resize', () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            requestAnimationFrame(() => updateImage(Math.floor((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * frameCount) || 0));
        });

        scroll((info) => {
            // framer-motion scroll can return either a straight progress number or an info object
            let p = 0;
            if (typeof info === 'number') {
                p = info;
            } else if (info && info.y) {
                p = info.y.progress;
            } else if (info && typeof info.progress === 'number') {
                p = info.progress;
            } else {
                return; // fail silently if nothing matches
            }
            
            // Map progress to frame index
            const frameIndex = Math.min(
                frameCount - 1,
                Math.max(0, Math.floor(p * frameCount))
            );
            
            requestAnimationFrame(() => updateImage(frameIndex));
            
            // 4 Text steps fading in/out
            const segment = 1 / heroSteps.length;
            heroSteps.forEach((step, index) => {
                const startFadeIn = index * segment;
                const endFadeIn = startFadeIn + (segment * 0.2);
                const startFadeOut = startFadeIn + (segment * 0.8);
                const endFadeOut = (index + 1) * segment;

                let opacity = 0;
                let scale = 1.1;

                if (p >= startFadeIn && p <= endFadeIn) {
                    const localP = (p - startFadeIn) / (segment * 0.2);
                    opacity = localP;
                    scale = 0.95 + (localP * 0.05); 
                } else if (p > endFadeIn && p < startFadeOut) {
                    opacity = 1;
                    scale = 1;
                } else if (p >= startFadeOut && p <= endFadeOut) {
                    const localP = (p - startFadeOut) / (segment * 0.2);
                    opacity = 1 - localP;
                    scale = 1 + (localP * 0.05);
                } else if (p > endFadeOut) {
                    opacity = 0;
                }

                step.style.opacity = opacity;
                step.style.transform = `scale(${scale})`;
            });
            
            // Fade out the scroll indicator quickly
            const indicator = heroSeq.querySelector('.scroll-indicator');
            if (indicator) {
                indicator.style.opacity = Math.max(0, 1 - (p * 20));
            }
            
        }, {
            target: heroSeq,
            offset: ["start start", "end end"]
        });
    }

    // 5. Apple-like Details Section Scrolling
    const detailsSection = document.querySelector('#details');
    if (detailsSection) {
        const steps = document.querySelectorAll('.detail-step');
        const visual = document.querySelector('.details-visual');
        const img = visual.querySelector('img');

        scroll((info) => {
            let p = 0;
            if (typeof info === 'number') {
                p = info;
            } else if (info && info.y) {
                p = info.y.progress;
            } else if (info && typeof info.progress === 'number') {
                p = info.progress;
            } else {
                return;
            }
            
            // Visual container fade in/out
            if(p > 0.05 && p < 0.95) {
                // Fade in early, fade out late
                let visOpacity = 1;
                if(p < 0.1) visOpacity = (p - 0.05) / 0.05;
                if(p > 0.9) visOpacity = (0.95 - p) / 0.05;
                visual.style.opacity = visOpacity;
            } else {
                visual.style.opacity = 0;
            }

            // Image scaling effect
            if (img) {
                img.style.transform = `scale(${1 + (p * 0.3)})`;
            }

            // Stagger text steps
            const stepCount = steps.length;
            const segment = 1 / stepCount;

            steps.forEach((step, index) => {
                const startFadeIn = index * segment;
                const endFadeIn = startFadeIn + (segment * 0.2);
                const startFadeOut = startFadeIn + (segment * 0.8);
                const endFadeOut = (index + 1) * segment;

                let opacity = 0;
                let y = 50;

                if (p >= startFadeIn && p <= endFadeIn) {
                    // Fading in
                    const localP = (p - startFadeIn) / (segment * 0.2);
                    opacity = localP;
                    y = 50 - (localP * 50);
                } else if (p > endFadeIn && p < startFadeOut) {
                    // Holding state
                    opacity = 1;
                    y = 0;
                } else if (p >= startFadeOut && p <= endFadeOut) {
                    // Fading out
                    const localP = (p - startFadeOut) / (segment * 0.2);
                    opacity = 1 - localP;
                    y = -localP * 50;
                } else if (p > endFadeOut) {
                    // Past step
                    opacity = 0;
                    y = -50;
                }

                step.style.opacity = opacity;
                step.style.transform = `translateY(-50%) translateY(${y}px)`;
            });

        }, {
            target: detailsSection,
            offset: ["start start", "end end"]
        });
    }

    // 6. In-View reveals for standard sections
    // General fades
    inView(".motion-fade", (info) => {
        animate(info.target, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8 });
    });

    // Pricing Cards Stagger
    inView(".pricing-section", () => {
        animate(
            ".motion-card",
            { opacity: [0, 1], scale: [0.9, 1] },
            { duration: 0.6, delay: stagger(0.2) }
        );
    });

    // Features Stagger
    inView(".features", () => {
        animate(
            ".motion-fade-up",
            { opacity: [0, 1], y: [50, 0] },
            { duration: 0.8, delay: stagger(0.15) }
        );
    });

    // Transformation Slide-Ins
    document.querySelectorAll('.motion-slide-in').forEach((el, i) => {
        inView(el, (info) => {
            const direction = i % 2 === 0 ? -100 : 100;
            animate(
                info.target,
                { opacity: [0, 1], x: [direction, 0] },
                { duration: 1, easing: [0.165, 0.84, 0.44, 1] } // Custom spring-like easing
            );
        }, { margin: "-100px" });
    });
});
