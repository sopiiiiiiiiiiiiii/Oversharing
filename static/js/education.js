// ============================================================
// EDUCATION — Premium Interactivity + Video + Feedback
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
  // 2. RISK CARDS — muncul staggered
  // ============================================================

  const riskCards = document.querySelectorAll('.risk-edu-card');

  const revealRiskCards = () => {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    riskCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const delay = parseInt(card.dataset.delay) || 0;

      if (rect.top < triggerPoint) {
        setTimeout(() => {
          card.classList.add('visible');
        }, delay);
      }
    });
  };

  setTimeout(revealRiskCards, 300);
  window.addEventListener('scroll', revealRiskCards, { passive: true });

  // ============================================================
  // 3. COUNTER ANIMASI — statistik di overview
  // ============================================================

  const statNumbers = document.querySelectorAll('.stat-block .stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;

    const statsSection = document.querySelector('.edu-overview-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      countersAnimated = true;

      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.count) || 0;
        let current = 0;
        const duration = 1200;
        const step = target / (duration / 16);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + '%';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + '%';
          }
        }, 16);
      });
    }
  };

  window.addEventListener('scroll', animateCounters, { passive: true });
  setTimeout(animateCounters, 500);

  // ============================================================
  // 4. RISK BAR — animasi di examples
  // ============================================================

  const riskBars = document.querySelectorAll('.risk-bar div');
  let barsAnimated = false;

  const animateBars = () => {
    if (barsAnimated) return;

    const examplesSection = document.querySelector('.edu-examples-grid');
    if (!examplesSection) return;

    const rect = examplesSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      barsAnimated = true;
      riskBars.forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = w;
        }, 100);
      });
    }
  };

  window.addEventListener('scroll', animateBars, { passive: true });
  setTimeout(animateBars, 600);

  // ============================================================
  // 5. FEEDBACK LOOP
  // ============================================================

  const sendBtn = document.getElementById('sendFeedbackBtn');
  const feedbackText = document.getElementById('feedbackText');
  const feedbackType = document.getElementById('feedbackType');
  const successMsg = document.getElementById('feedbackSuccess');

  if (sendBtn && feedbackText) {
    sendBtn.addEventListener('click', () => {
      const text = feedbackText.value.trim();
      const type = feedbackType.value;

      if (!text) {
        alert('✏️ Harap tulis feedback terlebih dahulu.');
        return;
      }

      // Simulasi kirim (bisa diganti dengan fetch ke backend)
      console.log('📤 Feedback dikirim:', { type, text });

      // Tampilkan success
      successMsg.style.display = 'block';
      feedbackText.value = '';
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);
    });

    // Shift+Enter untuk kirim
    feedbackText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });
  }

  // ============================================================
  // 6. VIDEO — Lazy load (opsional)
  // ============================================================

  const videos = document.querySelectorAll('.video-embed iframe');

  const lazyLoadVideos = () => {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    videos.forEach(video => {
      const rect = video.closest('.video-card').getBoundingClientRect();
      if (rect.top < triggerPoint) {
        const src = video.getAttribute('data-src');
        if (src && !video.src) {
          video.src = src;
        }
      }
    });
  };

  // Jika pakai data-src, aktifkan lazy load
  // videos.forEach(v => {
  //   const src = v.getAttribute('src');
  //   if (src) {
  //     v.setAttribute('data-src', src);
  //     v.removeAttribute('src');
  //   }
  // });
  // window.addEventListener('scroll', lazyLoadVideos, { passive: true });
  // setTimeout(lazyLoadVideos, 500);

  // ============================================================
  // 7. TOMBOL CTA — efek klik
  // ============================================================

  const ctaBtn = document.querySelector('.edu-cta .btn-primary');
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
  // 8. CONSOLE
  // ============================================================

  console.log('✦ ShareWise Education — loaded with animations & video ✦');
});