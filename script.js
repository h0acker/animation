import { animate, scroll, inView, stagger } from "motion";

document.addEventListener("DOMContentLoaded", () => {

    /* ================= NAVBAR SCROLL ================= */
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });

    /* ================= MOBILE MENU ================= */
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        // Close menu on click (mobile UX)
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }

    /* ================= NAV ANIMATION ================= */
    animate(".motion-nav-item", {
        opacity: [0, 1],
        y: [-20, 0]
    }, {
        duration: 0.8,
        delay: stagger(0.1)
    });

    /* ================= MOBILE PERFORMANCE CHECK ================= */
    const isMobile = window.innerWidth < 900;

    /* ========================================================= */
    /* ================= HERO CANVAS (DESKTOP ONLY) ============= */
    /* ========================================================= */

    if (!isMobile) {

        const heroSeq = document.querySelector(".hero-sequence");

        if (heroSeq) {
            const canvas = document.getElementById("hero-canvas");
            const context = canvas.getContext("2d");
            const heroSteps = document.querySelectorAll(".hero-step");

            const frameCount = 120; // reduced from 240 (performance boost)

            const currentFrame = i =>
                `assets/herosection/ezgif-frame-${(i + 1)
                    .toString()
                    .padStart(3, "0")}.png`;

            const images = [];

            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                images.push(img);
            }

            const updateImage = index => {
                const img = images[index];
                if (!img || !img.complete) return;

                const dpr = window.devicePixelRatio || 1;
                const cw = canvas.clientWidth * dpr;
                const ch = canvas.clientHeight * dpr;

                canvas.width = cw;
                canvas.height = ch;

                context.clearRect(0, 0, cw, ch);
                context.drawImage(img, 0, 0, cw, ch);
            };

            images[0].onload = () => updateImage(0);

            scroll((p) => {
                const frameIndex = Math.floor(p * (frameCount - 1));
                requestAnimationFrame(() => updateImage(frameIndex));

                /* TEXT FADE */
                const segment = 1 / heroSteps.length;

                heroSteps.forEach((step, i) => {
                    const start = i * segment;
                    const end = start + segment;

                    step.style.opacity = (p >= start && p <= end) ? 1 : 0;
                });

            }, {
                target: heroSeq
            });
        }
    }

    /* ========================================================= */
    /* ================= DETAILS SECTION ======================== */
    /* ========================================================= */

    const detailsSection = document.querySelector("#details");

    if (detailsSection && !isMobile) {

        const steps = document.querySelectorAll(".detail-step");

        scroll((p) => {
            const segment = 1 / steps.length;

            steps.forEach((step, i) => {
                const start = i * segment;
                const end = start + segment;

                step.style.opacity = (p >= start && p <= end) ? 1 : 0;
            });

        }, {
            target: detailsSection
        });
    }

    /* ========================================================= */
    /* ================= IN-VIEW ANIMATIONS ===================== */
    /* ========================================================= */

    inView(".motion-fade", (el) => {
        animate(el.target, {
            opacity: [0, 1],
            y: [30, 0]
        }, { duration: 0.8 });
    });

    inView(".pricing-section", () => {
        animate(".motion-card", {
            opacity: [0, 1],
            scale: [0.9, 1]
        }, {
            duration: 0.6,
            delay: stagger(0.2)
        });
    });

    inView(".features", () => {
        animate(".motion-fade-up", {
            opacity: [0, 1],
            y: [50, 0]
        }, {
            duration: 0.8,
            delay: stagger(0.15)
        });
    });

    document.querySelectorAll(".motion-slide-in").forEach((el, i) => {
        inView(el, (info) => {
            const dir = i % 2 === 0 ? -100 : 100;

            animate(info.target, {
                opacity: [0, 1],
                x: [dir, 0]
            }, {
                duration: 1
            });

        });
    });

});
