// ============================================================
// ABOUT — Premium Interactivity
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. SCROLL REVEAL — semua section
  // ============================================================

  const revealSections = document.querySelectorAll('.reveal-section');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    revealSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < triggerPoint) {
        section.classList.add('visible');
      }
    });
  };

  setTimeout(revealOnScroll, 200);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        revealOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ============================================================
  // 2. COUNTER ANIMASI — statistik di hero
  // ============================================================

  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;

    const statsSection = document.querySelector('.about-hero-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      countersAnimated = true;

      statNumbers.forEach(el => {
        const target = parseFloat(el.dataset.count) || 0;
        const isFloat = target % 1 !== 0;
        let current = 0;
        const duration = 1400;
        const step = target / (duration / 16);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = isFloat ? target.toFixed(1) : Math.floor(target);
            clearInterval(timer);
          } else {
            el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
          }
        }, 16);
      });
    }
  };

  window.addEventListener('scroll', animateCounters, { passive: true });
  setTimeout(animateCounters, 500);

  // ============================================================
  // 3. TOMBOL CTA — efek klik
  // ============================================================

  const ctaBtn = document.querySelector('.about-cta .btn-primary');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ctaBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        ctaBtn.style.transform = '';
        window.location.href = ctaBtn.getAttribute('href');
      }, 200);
    });
  }

  // ============================================================
  // 4. CONSOLE LOG
  // ============================================================

  console.log('✦ ShareWise About — loaded with animations ✦');
});