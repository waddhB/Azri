// // =========================================
// // AZRI GSAP ANIMATIONS - ENTERPRISE LEVEL
// // Optimized & Fixed
// // =========================================

// if (typeof AZRI_RTL === 'undefined') console.log('RTL module will load separately');

// document.addEventListener('DOMContentLoaded', () => {
//     'use strict';

//     if (typeof gsap === 'undefined') return console.warn('GSAP not loaded. Animations disabled.');
//     if (typeof ScrollTrigger === 'undefined') return console.warn('ScrollTrigger not loaded');

//     gsap.registerPlugin(ScrollTrigger);

//     const scrollOptions = (trigger) => ({
//         scrollTrigger: {
//             trigger,
//             start: 'top 80%',
//             end: 'bottom 20%',
//             toggleActions: 'play none none none',
//             once: true
//         }
//     });

//     // Kill specific tweens to avoid conflicts
//     gsap.killTweensOf('.hero-title, .services-section .service-card, .partners-section .partner-card');

//     // ===== HERO ANIMATIONS =====
//     if (document.querySelector('.hero-title')) {
//         gsap.timeline()
//             .from('.hero-title', { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' })
//             .from('.hero-subtitle', { y: 50, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.8')
//             .from('.hero-description', { y: 50, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.7')
//             .from('.hero-buttons .btn', { y: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5')
//             .from('.partner-strip', { y: 100, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.3');
//     }

//     // ===== CIRCUIT PATTERN ANIMATION =====
//     if (document.querySelector('.circuit-pattern')) {
//         gsap.to('.circuit-pattern', { rotation: 360, duration: 300, repeat: -1, ease: 'none', opacity: 0.3 });
//     }

//     // ===== GENERIC SECTION ANIMATION FUNCTION =====
//     const animateSection = (section, elements = [], options = {}) => {
//         elements.forEach(el => {
//             if (document.querySelector(el.selector)) {
//                 gsap.from(el.selector, {
//                     ...scrollOptions(section),
//                     ...el.anim
//                 });
//             }
//         });
//     };

//     // ===== SECTIONS =====
//     if (document.querySelector('.services-section')) {
//         animateSection('.services-section', [
//             { selector: '.section-title', anim: { y: 50, opacity: 0, duration: 1 } },
//             { selector: '.section-subtitle', anim: { y: 30, opacity: 0, duration: 0.8, delay: 0.2 } },
//             { selector: '.service-card', anim: { y: 100, opacity: 0, duration: 1, stagger: 0.2 } }
//         ]);
//     }

//     if (document.querySelector('.why-section')) {
//         animateSection('.why-section', [
//             { selector: '.feature-item', anim: { y: 50, opacity: 0, duration: 0.8, stagger: 0.15 } }
//         ]);
//     }

//     if (document.querySelector('.partners-section') || document.querySelector('.partners-centered')) {
//         animateSection('.partners-section, .partners-centered', [
//             { selector: '.section-title', anim: { y: 50, opacity: 0, duration: 1 } },
//             { selector: '.section-subtitle', anim: { y: 30, opacity: 0, duration: 0.8, delay: 0.2 } },
//             { selector: '.partner-card', anim: { scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' } }
//         ]);
//     }

//     if (document.querySelector('.cert-grid') || document.querySelector('.cert-item')) {
//         animateSection('.cert-grid', [
//             { selector: '.cert-item', anim: { y: 50, opacity: 0, duration: 0.8, stagger: 0.15 } }
//         ]);
//     }

//     if (document.querySelector('.service-category')) {
//         animateSection('.service-category', [
//             { selector: '.product-item', anim: { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 } }
//         ]);
//     }

//     // ===== HERO PARALLAX =====
//     if (document.querySelector('.hero-background')) {
//         gsap.to('.hero-background', {
//             scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
//             y: 200,
//             ease: 'none'
//         });
//     }

//     // ===== COUNTER =====
//     const animateCounter = (el, start, end, duration) => {
//         if (!el) return;
//         gsap.to({ count: start }, {
//             count: end,
//             duration,
//             ease: 'power4.out',
//             onUpdate: function() { el.textContent = Math.floor(this.targets()[0].count); }
//         });
//     };
//     animateCounter(document.querySelector('.experience-badge .years'), 0, 10, 2);

//     // ===== LAZY LOAD IMAGES =====
//     if ('IntersectionObserver' in window) {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     const img = entry.target;
//                     if (img.dataset.src) img.src = img.dataset.src;
//                     img.classList.add('loaded');
//                     observer.unobserve(img);
//                 }
//             });
//         });
//         document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
//     }

//     // ===== MOBILE MENU AUTO CLOSE =====
//     const navbarToggler = document.querySelector('.navbar-toggler');
//     if (navbarToggler) {
//         document.querySelectorAll('.nav-link').forEach(link => {
//             link.addEventListener('click', () => {
//                 const navbarCollapse = document.querySelector('.navbar-collapse');
//                 if (window.innerWidth < 992 && navbarCollapse?.classList.contains('show')) navbarToggler.click();
//             });
//         });
//     }

//     // ===== ACTIVE LINK =====
//     const setActiveLink = () => {
//         const currentPath = window.location.pathname;
//         const currentPage = currentPath.split('/').pop() || 'index.html';
//         document.querySelectorAll('.nav-link').forEach(link => {
//             link.classList.remove('active');
//             const href = link.getAttribute('href');
//             if (currentPath.includes('/ar/')) {
//                 if (href?.includes('/ar/')) link.classList.add('active');
//             } else {
//                 if (href === currentPage || (['', 'index.html'].includes(currentPage) && href === 'index.html')) link.classList.add('active');
//             }
//         });
//     };
//     setActiveLink();

//     // ===== SMOOTH SCROLL =====
//     document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a => {
//         a.addEventListener('click', e => {
//             e.preventDefault();
//             document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         });
//     });

//     // ===== FINAL REFRESH =====
//     ScrollTrigger.refresh();
// });

// // ===== REINIT ON RESIZE/LOAD =====
// ['resize', 'load'].forEach(ev => window.addEventListener(ev, () => ScrollTrigger?.refresh()));
// ===== CIRCUIT PATTERN ANIMATION =====
if (document.querySelector('.circuit-pattern')) {
    // دوران بطيء للنمط
    gsap.to('.circuit-pattern', {
        rotation: 360,
        duration: 300,
        repeat: -1,
        ease: 'none',
        opacity: 0.3
    });
    
    // حركة خفيفة للخلفية
    gsap.to('.hero-background', {
        scale: 1.1,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// ===== PARALLAX EFFECT =====
if (document.querySelector('.hero-background')) {
    gsap.to('.hero-background', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        ease: 'none'
    });
}
// ===== PROFESSIONAL GSAP BACKGROUND ANIMATIONS =====
if (typeof gsap !== 'undefined') {
    
    // Floating Particles Animation
    gsap.to('.particle', {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        scale: 'random(0.5, 1.5)',
        rotation: 'random(0, 360)',
        duration: 'random(10, 20)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
    });
    
    // Geometric Shapes Rotation
    gsap.to('.shape', {
        rotation: 360,
        scale: 1.2,
        duration: 20,
        repeat: -1,
        ease: 'none',
        stagger: 2
    });
    
    // Circuit Lines Pulse
    gsap.to('.circuit-network', {
        backgroundSize: '60px 60px',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    // Energy Waves Movement
    gsap.to('.wave', {
        x: 'random(-50, 50)',
        y: 'random(-50, 50)',
        scale: 1.1,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}