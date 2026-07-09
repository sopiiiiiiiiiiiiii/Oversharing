// ============================================
// ABOUT PAGE — ADDITIONAL JS
// ============================================

// --- Counter Animation (Statistik Hero) ---
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const text = counter.textContent;
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');

        if (!isNaN(num) && num > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let current = 0;
                        const increment = num / 60;
                        const interval = setInterval(() => {
                            current += increment;
                            if (current >= num) {
                                current = num;
                                clearInterval(interval);
                            }
                            let display = Math.floor(current).toLocaleString();
                            // Tambahkan suffix (misal: +, M, %)
                            if (suffix === '+') {
                                counter.textContent = display + '+';
                            } else if (suffix === 'M') {
                                counter.textContent = display + 'M';
                            } else if (suffix === '%') {
                                counter.textContent = display + '%';
                            } else {
                                counter.textContent = display + suffix;
                            }
                        }, 20);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        }
    });
});

// --- Smooth scroll untuk anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// --- Intersection Observer untuk fade-in cards ---
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.mission-card, .value-card, .team-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);

        // Langsung tampilkan jika elemen sudah terlihat saat load
        if (card.getBoundingClientRect().top < window.innerHeight) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
} else {
    // Fallback jika IntersectionObserver tidak didukung
    document.querySelectorAll('.mission-card, .value-card, .team-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
}