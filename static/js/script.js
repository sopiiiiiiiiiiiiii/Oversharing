// ============================================================
// SHAREWISE — SCRIPT UTAMA (Clean Version)
// Menu Toggle | Navbar Scroll | Back to Top | Page Transition
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. TOGGLE MENU (Hamburger)
    // ============================================================

    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (toggle && navLinks) {

        // --- Buka/tutup menu saat toggle diklik ---
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('is-open');
            toggle.classList.toggle('is-active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        // --- Tutup menu saat salah satu link diklik ---
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('is-open');
                toggle.classList.remove('is-active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        // --- Tutup menu saat klik di luar navbar ---
        document.addEventListener('click', function(e) {
            var navbar = document.querySelector('.navbar');
            if (navbar && !navbar.contains(e.target)) {
                navLinks.classList.remove('is-open');
                toggle.classList.remove('is-active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        console.log('✓ Menu toggle ready');
    } else {
        console.warn('⚠️ Menu toggle element not found');
    }

    // ============================================================
    // 2. NAVBAR SCROLL EFFECT
    // ============================================================

    var navbar = document.getElementById('navbar');
    if (navbar) {
        var setScrolled = function() {
            navbar.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        setScrolled();
        window.addEventListener('scroll', setScrolled, { passive: true });
        console.log('✓ Navbar scroll ready');
    }

    // ============================================================
    // 3. BACK TO TOP BUTTON
    // ============================================================

    var backToTop = document.getElementById('backToTop');
    if (backToTop) {

        var toggleBackToTop = function() {
            backToTop.classList.toggle('is-visible', window.scrollY > 300);
        };

        toggleBackToTop();

        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    toggleBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        console.log('✓ Back to Top ready');
    }

    // ============================================================
    // 4. PAGE TRANSITION (Smooth navigation)
    // ============================================================

    var transitionEl = document.getElementById('pageTransition');
    if (transitionEl) {

        // Reset state
        transitionEl.classList.remove('is-exiting');

        // Ambil semua link internal
        var links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');
        var isNavigating = false;

        var navigateWithTransition = function(url) {
            if (isNavigating) return;
            isNavigating = true;

            transitionEl.classList.add('is-exiting');

            setTimeout(function() {
                window.location.href = url;
            }, 400);
        };

        links.forEach(function(link) {
            var href = link.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    navigateWithTransition(href);
                });
            }
        });

        // Reset saat back/forward
        window.addEventListener('popstate', function() {
            transitionEl.classList.remove('is-exiting');
            isNavigating = false;
        });

        console.log('✓ Page transition ready');
    }

    // ============================================================
    // 5. READY
    // ============================================================

    console.log('✦ ShareWise — All systems ready ✦');

});
