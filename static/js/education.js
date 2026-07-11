// ============================================================
// EDUCATION — Full Interactivity
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

  // ============================================================
  // 1. SCROLL REVEAL
  // ============================================================

  const revealSections = document.querySelectorAll('.reveal-section');

  const revealOnScroll = function() {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    revealSections.forEach(function(section) {
      const rect = section.getBoundingClientRect();
      if (rect.top < triggerPoint) {
        section.classList.add('visible');
      }
    });
  };

  setTimeout(revealOnScroll, 200);

  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        revealOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ============================================================
  // 2. RISK CARDS — staggered muncul
  // ============================================================

  const riskCards = document.querySelectorAll('.risk-edu-card');

  const revealRiskCards = function() {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    riskCards.forEach(function(card) {
      const rect = card.getBoundingClientRect();
      const delay = parseInt(card.dataset.delay) || 0;

      if (rect.top < triggerPoint) {
        setTimeout(function() {
          card.classList.add('visible');
        }, delay);
      }
    });
  };

  setTimeout(revealRiskCards, 300);
  window.addEventListener('scroll', revealRiskCards, { passive: true });

  // ============================================================
  // 3. COUNTER ANIMASI — statistik
  // ============================================================

  const statNumbers = document.querySelectorAll('.stat-block .stat-number');
  let countersAnimated = false;

  const animateCounters = function() {
    if (countersAnimated) return;

    const statsSection = document.querySelector('.edu-overview-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      countersAnimated = true;

      statNumbers.forEach(function(el) {
        const target = parseInt(el.dataset.count) || 0;
        let current = 0;
        const duration = 1200;
        const step = target / (duration / 16);

        const timer = setInterval(function() {
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

  const animateBars = function() {
    if (barsAnimated) return;

    const examplesSection = document.querySelector('.edu-examples-grid');
    if (!examplesSection) return;

    const rect = examplesSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      barsAnimated = true;
      riskBars.forEach(function(bar) {
        var w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(function() {
          bar.style.width = w;
        }, 100);
      });
    }
  };

  window.addEventListener('scroll', animateBars, { passive: true });
  setTimeout(animateBars, 600);

  // ============================================================
  // 5. ARTIKEL TOGGLE — Baca Selengkapnya
  // ============================================================

  const articleToggles = document.querySelectorAll('.btn-article-toggle');

  articleToggles.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = this.closest('.article-card');
      var fullContent = card.querySelector('.article-full');
      var isOpen = fullContent.classList.toggle('open');
      this.classList.toggle('active');
      this.textContent = isOpen ? 'Sembunyikan' : 'Baca Selengkapnya';
    });
  });

  // ============================================================
  // 6. FEEDBACK LOOP
  // ============================================================

  const sendBtn = document.getElementById('sendFeedbackBtn');
  const feedbackText = document.getElementById('feedbackText');
  const feedbackType = document.getElementById('feedbackType');
  const successMsg = document.getElementById('feedbackSuccess');

  if (sendBtn && feedbackText) {
    sendBtn.addEventListener('click', function() {
      var text = feedbackText.value.trim();
      var type = feedbackType.value;

      if (!text) {
        alert('Harap tulis feedback terlebih dahulu.');
        return;
      }

      console.log('Feedback dikirim:', { type: type, text: text });

      successMsg.style.display = 'block';
      feedbackText.value = '';
      setTimeout(function() {
        successMsg.style.display = 'none';
      }, 5000);
    });

    feedbackText.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });
  }

  // ============================================================
  // 7. TOMBOL CTA — efek klik
  // ============================================================

  var ctaBtn = document.querySelector('.edu-cta .btn-primary');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function(e) {
      e.preventDefault();
      ctaBtn.style.transform = 'scale(0.95)';
      setTimeout(function() {
        ctaBtn.style.transform = '';
        window.location.href = ctaBtn.getAttribute('href');
      }, 200);
    });
  }

  // ============================================================
  // 8. CONSOLE
  // ============================================================

  console.log('✦ ShareWise Education — loaded! ✦');

});
