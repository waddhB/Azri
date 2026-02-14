




// ===== Parallax effect for hero section =====
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: 200,
    opacity: 0.3,
    ease: 'none'
});




function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const scrollPosition = window.scrollY;
    const whiteSections = document.querySelectorAll('#services-section, #why-section, #partners-section, #contact-section');
    let isOverWhiteSection = false;
    whiteSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            isOverWhiteSection = true;
        }
    });
    if (scrollPosition > 50) {
        navbar.classList.add('navbar-scrolled');
        navbar.classList.remove('navbar-light-bg');
    } else if (isOverWhiteSection) {
        navbar.classList.add('navbar-light-bg');
        navbar.classList.remove('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-light-bg', 'navbar-scrolled');
    }
}
window.addEventListener('scroll', updateNavbarBackground);
window.addEventListener('load', updateNavbarBackground);
