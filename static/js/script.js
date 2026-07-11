// ShareWise — shared site behavior

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const navbar = document.getElementById('navbar');
  if (navbar) {
    const setScrolled = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }
});
// ============================================================
// SCRIPT — Transisi halus + navbar scroll
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1. Navbar scroll ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const setScrolled = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  // ---- 2. Page transition smooth ----
  const transitionEl = document.getElementById('pageTransition');
  const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');

  // Cegah transisi berlebihan saat back/forward
  let isNavigating = false;

  const navigateWithTransition = (url) => {
    if (isNavigating) return;
    isNavigating = true;

    // Aktifkan exit animation
    transitionEl.classList.add('is-exiting');

    // Tunggu animasi selesai, baru pindah
    setTimeout(() => {
      window.location.href = url;
    }, 500); // durasi sesuai CSS (0.5s)
  };

  // Pasang event listener ke semua link internal
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateWithTransition(href);
      });
    }
  });

  // ---- 3. Reset state saat halaman dimuat ----
  if (transitionEl) {
    // Hapus class is-exiting jika ada (misal dari back/forward)
    transitionEl.classList.remove('is-exiting');

    // Tambah class no-animation untuk mencegah flash di load pertama
    transitionEl.classList.add('no-animation');
    setTimeout(() => {
      transitionEl.classList.remove('no-animation');
    }, 100);
  }

  // ---- 4. Handle popstate (back/forward) ----
  window.addEventListener('popstate', () => {
    if (transitionEl) {
      transitionEl.classList.remove('is-exiting');
    }
    isNavigating = false;
  });

  // ---- 5. Console ----
  console.log('✦ ShareWise — Smooth page transitions ready ✦');
});
// ============================================================
// SCRIPT — Back to Top + Navbar + Transisi
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- 1. Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const setScrolled = () => {
            navbar.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        setScrolled();
        window.addEventListener('scroll', setScrolled, { passive: true });
    }

    // ---- 2. Back to Top Button ----
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        // Tampilkan/sembunyikan tombol
        const toggleBackToTop = () => {
            const scrollY = window.scrollY;
            // Muncul setelah scroll lebih dari 300px
            const threshold = 300;
            backToTop.classList.toggle('is-visible', scrollY > threshold);
        };

        // Jalankan pertama kali
        toggleBackToTop();

        // Event scroll (dengan throttle sederhana)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    toggleBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Klik → smooth scroll ke atas
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Aksesibilitas: keyboard (Enter/Space sudah otomatis untuk tombol)
    }

    // ---- 3. Page transition (jika pakai) ----
    const transitionEl = document.getElementById('pageTransition');
    if (transitionEl) {
        // Hapus class is-exiting jika ada (dari back/forward)
        transitionEl.classList.remove('is-exiting');

        // Tangkap semua link internal
        const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');
        const navigateWithTransition = (url) => {
            transitionEl.classList.add('is-exiting');
            setTimeout(() => {
                window.location.href = url;
            }, 400);
        };

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateWithTransition(href);
                });
            }
        });
    }

    // ---- 4. Console ----
    console.log('✦ ShareWise — Back to Top ready ✦');
});