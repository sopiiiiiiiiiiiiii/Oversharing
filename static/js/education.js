// ============================================================
// EDUCATION PAGE — Interaktivitas
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. SCROLL REVEAL — kartu risiko muncul satu per satu
  // ============================================================

  const riskCards = document.querySelectorAll('.risk-edu-card');

  const revealCards = () => {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    riskCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const delay = parseInt(card.dataset.delay) || 0;

      if (rect.top < triggerPoint) {
        setTimeout(() => {
          card.classList.add('visible');
        }, delay);
      }
    });
  };

  // Jalankan saat load
  setTimeout(revealCards, 200);

  // Jalankan saat scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        revealCards();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ============================================================
  // 2. ANIMASI RISK BAR — di contoh oversharing
  // ============================================================

  const riskBars = document.querySelectorAll('.risk-bar div');

  const animateBars = () => {
    const windowHeight = window.innerHeight;

    riskBars.forEach((bar) => {
      const rect = bar.closest('.example-card').getBoundingClientRect();
      const targetWidth = bar.style.width;

      if (rect.top < windowHeight * 0.85) {
        // Sudah terlihat, pastikan width-nya sesuai
        bar.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        // Width sudah di-set inline dari HTML
      }
    });
  };

  // Jalankan setelah sedikit delay biar efeknya kelihatan
  setTimeout(animateBars, 400);
  window.addEventListener('scroll', animateBars, { passive: true });

  // ============================================================
  // 3. HOVER EFEK UNTUK TYPE CARD (di-handle CSS)
  // ============================================================

  // ============================================================
  // 4. COUNTER ANIMASI UNTUK STATISTIK (opsional)
  // ============================================================

  const statNumbers = document.querySelectorAll('.stat-block .stat-number');
  let counterAnimated = false;

  const animateCounters = () => {
    if (counterAnimated) return;

    const windowHeight = window.innerHeight;
    const statsSection = document.querySelector('.edu-overview-stats');

    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();

    if (rect.top < windowHeight * 0.85) {
      counterAnimated = true;

      statNumbers.forEach((el) => {
        const text = el.textContent;
        const number = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');

        if (isNaN(number)) return;

        let current = 0;
        const duration = 1200;
        const step = number / (duration / 16);

        const timer = setInterval(() => {
          current += step;
          if (current >= number) {
            el.textContent = number + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + suffix;
          }
        }, 16);
      });
    }
  };

  // Jalankan counter saat scroll
  window.addEventListener('scroll', animateCounters, { passive: true });
  setTimeout(animateCounters, 500);

  // ============================================================
  // 5. TOMBOL "MULAI KUIS" — efek klik
  // ============================================================

  const ctaBtn = document.querySelector('.edu-cta .btn-primary');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      // Efek visual kecil sebelum navigasi
      ctaBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        ctaBtn.style.transform = '';
      }, 200);
    });
  }

  // ============================================================
  // 6. TIPS CARD — efek staggered masuk (sudah di CSS)
  // ============================================================

  // ============================================================
  // 7. LOG CONSOLE — friendly message
  // ============================================================

  console.log('✦ ShareWise — Education page loaded! Stay safe online ✦');
});