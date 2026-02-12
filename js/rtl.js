/* =========================================
   AZRI RTL DETECTION - Complete RTL JavaScript
   Handles Arabic language direction and RTL support
   ========================================= */

(function() {
    'use strict';

    // ===== RTL DETECTION AND INITIALIZATION =====
    function initRTL() {
        const html = document.documentElement;
        const path = window.location.pathname;
        
        // Check if current page is in Arabic folder
        const isArabic = path.includes('/ar/') || 
                        path.startsWith('/ar') || 
                        path === '/ar' ||
                        path === '/ar/index.html';
        
        if (isArabic) {
            // Set RTL attributes
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
            html.classList.add('rtl');
            
            // Load RTL CSS if not already loaded
            loadRTLStylesheet();
            
            // Update meta tags for Arabic
            updateMetaTags();
            
            console.log('AZRI: RTL mode activated for Arabic');
        } else {
            // Set LTR for English
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            html.classList.remove('rtl');
            
            console.log('AZRI: LTR mode activated for English');
        }
    }

    // ===== LOAD RTL STYLESHEET =====
    function loadRTLStylesheet() {
        // Check if RTL stylesheet is already loaded
        const existingLink = document.querySelector('link[href*="rtl.css"]');
        if (existingLink) return;
        
        // Create new link element for RTL CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../css/rtl.css'; // Path from /ar/ folder
        link.id = 'rtl-stylesheet';
        
        // Fallback path for root directory
        const fallbackLink = document.createElement('link');
        fallbackLink.rel = 'stylesheet';
        fallbackLink.href = 'css/rtl.css'; // Path from root
        
        // Try to load from /ar/ path first
        if (window.location.pathname.includes('/ar/')) {
            document.head.appendChild(link);
        } else {
            document.head.appendChild(fallbackLink);
        }
    }

    // ===== UPDATE META TAGS FOR ARABIC =====
    function updateMetaTags() {
        // Update title
        const title = document.querySelector('title');
        if (title && !title.textContent.includes('أزري')) {
            // Default Arabic titles will be set in HTML
        }
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            // Arabic descriptions are set in HTML
        }
    }

    // ===== FIX BOOTSTRAP RTL COMPONENTS =====
    function fixBootstrapRTL() {
        if (document.dir === 'rtl') {
            // Fix dropdown menus
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.style.textAlign = 'right';
            });
            
            // Fix carousel controls
            const carouselPrev = document.querySelectorAll('.carousel-control-prev');
            const carouselNext = document.querySelectorAll('.carousel-control-next');
            
            carouselPrev.forEach(control => {
                control.setAttribute('data-bs-slide', 'next');
            });
            
            carouselNext.forEach(control => {
                control.setAttribute('data-bs-slide', 'prev');
            });
            
            // Fix modal close button
            const modalCloseBtns = document.querySelectorAll('.modal-header .btn-close');
            modalCloseBtns.forEach(btn => {
                btn.style.margin = '-0.5rem auto -0.5rem -0.5rem';
            });
        }
    }

    // ===== SWITCH LANGUAGE FUNCTION =====
    window.switchLanguage = function() {
        const currentPath = window.location.pathname;
        let newPath = '';
        
        if (currentPath.includes('/ar/')) {
            // Switch to English
            newPath = currentPath.replace('/ar/', '/');
            if (newPath === '/') newPath = '/index.html';
        } else {
            // Switch to Arabic
            const fileName = currentPath.split('/').pop() || 'index.html';
            newPath = '/ar/' + fileName;
        }
        
        window.location.href = newPath;
    };

    // ===== DETECT BROWSER LANGUAGE =====
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const isArabicBrowser = browserLang.startsWith('ar');
        
        // Only redirect if on root and no language preference is set
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            const hasLanguagePreference = localStorage.getItem('azri-language');
            
            if (!hasLanguagePreference && isArabicBrowser) {
                // Ask user if they want to switch to Arabic
                const switchToArabic = confirm('هل تفضل مشاهدة الموقع باللغة العربية؟\n\nWould you prefer to view the site in Arabic?');
                if (switchToArabic) {
                    localStorage.setItem('azri-language', 'ar');
                    window.location.href = '/ar/';
                } else {
                    localStorage.setItem('azri-language', 'en');
                }
            }
        }
    }

    // ===== SAVE LANGUAGE PREFERENCE =====
    function saveLanguagePreference() {
        const currentLang = document.documentElement.lang || 'en';
        localStorage.setItem('azri-language', currentLang);
    }

    // ===== FIX RTL FORM ELEMENTS =====
    function fixRTLForms() {
        if (document.dir === 'rtl') {
            const formElements = document.querySelectorAll('.form-control, .form-select');
            formElements.forEach(el => {
                el.style.textAlign = 'right';
            });
            
            // Fix input groups
            const inputGroups = document.querySelectorAll('.input-group');
            inputGroups.forEach(group => {
                const prepend = group.querySelector('.input-group-prepend');
                const append = group.querySelector('.input-group-append');
                
                if (prepend && append) {
                    group.style.flexDirection = 'row-reverse';
                }
            });
        }
    }

    // ===== FIX POSITIONING FOR RTL =====
    function fixRTLElements() {
        if (document.dir === 'rtl') {
            // Fix WhatsApp button position
            const whatsappBtn = document.querySelector('.whatsapp-btn');
            if (whatsappBtn) {
                whatsappBtn.style.right = 'auto';
                whatsappBtn.style.left = '30px';
            }
            
            // Fix back to top button
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) {
                backToTop.style.right = 'auto';
                backToTop.style.left = '30px';
            }
            
            // Fix fixed elements
            const fixedElements = document.querySelectorAll('.fixed-top, .fixed-bottom');
            fixedElements.forEach(el => {
                if (el.classList.contains('fixed-top') || el.classList.contains('fixed-bottom')) {
                    el.style.left = '0';
                    el.style.right = '0';
                }
            });
        }
    }

    // ===== OBSERVE DOM CHANGES FOR RTL =====
    function observeDOMChanges() {
        if (document.dir !== 'rtl') return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    fixRTLForms();
                    fixRTLElements();
                    fixBootstrapRTL();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ===== INITIALIZE ON PAGE LOAD =====
    document.addEventListener('DOMContentLoaded', function() {
        initRTL();
        fixBootstrapRTL();
        fixRTLForms();
        fixRTLElements();
        saveLanguagePreference();
        observeDOMChanges();
        
        // Only detect browser language on first visit
        if (!localStorage.getItem('azri-language')) {
            detectBrowserLanguage();
        }
    });

    // ===== REINITIALIZE ON HISTORY CHANGE =====
    window.addEventListener('popstate', function() {
        initRTL();
        fixBootstrapRTL();
        fixRTLForms();
        fixRTLElements();
    });

    // ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
    window.AZRI_RTL = {
        init: initRTL,
        switchLanguage: window.switchLanguage,
        fixRTLForms: fixRTLForms,
        fixBootstrapRTL: fixBootstrapRTL
    };

    console.log('AZRI RTL JS loaded and ready');
})();