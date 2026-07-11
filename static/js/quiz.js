// ============================================================
// QUIZ — Data & Logika Interaktif
// ============================================================

// ---- DATA SOAL ----
const quizData = [
  {
    id: 1,
    category: 'Umum',
    question: 'Apa yang dimaksud dengan oversharing?',
    options: [
      'Berbagi terlalu banyak informasi pribadi di media sosial',
      'Berbagi foto setiap hari',
      'Mengirim pesan terlalu sering',
      'Mengikuti terlalu banyak akun'
    ],
    correct: 0
  },
  {
    id: 2,
    category: 'Risiko',
    question: 'Manakah yang BUKAN merupakan risiko dari oversharing?',
    options: [
      'Pencurian identitas',
      'Serangan phishing',
      'Meningkatnya followers',
      'Stalking'
    ],
    correct: 2
  },
  {
    id: 3,
    category: 'Data Pribadi',
    question: 'Informasi pribadi apa yang paling berisiko jika dibagikan secara publik?',
    options: [
      'Hobi dan minat',
      'Nomor telepon dan alamat rumah',
      'Film favorit',
      'Makanan kesukaan'
    ],
    correct: 1
  },
  {
    id: 4,
    category: 'Keamanan',
    question: 'Apa yang sebaiknya dilakukan sebelum memposting foto liburan?',
    options: [
      'Tunggu sampai pulang baru posting',
      'Posting langsung dengan lokasi',
      'Posting setiap hari selama liburan',
      'Tidak perlu khawatir, itu aman'
    ],
    correct: 0
  },
  {
    id: 5,
    category: 'Privasi',
    question: 'Apa fungsi dari pengaturan privasi di media sosial?',
    options: [
      'Mengontrol siapa yang bisa melihat konten kita',
      'Menambah teman otomatis',
      'Membuat akun lebih populer',
      'Menghapus semua postingan'
    ],
    correct: 0
  },
  {
    id: 6,
    category: 'Ancaman',
    question: 'Apa itu social engineering?',
    options: [
      'Teknik manipulasi psikologis untuk mendapatkan informasi',
      'Cara membuat akun baru',
      'Metode mengedit foto',
      'Aplikasi desain grafis'
    ],
    correct: 0
  },
  {
    id: 7,
    category: 'Best Practice',
    question: 'Manakah tindakan keamanan digital yang paling efektif?',
    options: [
      'Menggunakan password yang sama untuk semua akun',
      'Aktifkan autentikasi dua faktor (2FA)',
      'Membagikan password ke teman dekat',
      'Tidak pernah mengganti password'
    ],
    correct: 1
  },
  {
    id: 8,
    category: 'Lokasi',
    question: 'Mengapa check-in lokasi real-time berbahaya?',
    options: [
      'Memberi tahu orang asing di mana kita berada saat itu',
      'Membuat postingan lebih keren',
      'Menambah fitur menarik',
      'Tidak ada bahaya sama sekali'
    ],
    correct: 0
  },
  {
    id: 9,
    category: 'Identitas',
    question: 'Apa dampak dari pencurian identitas?',
    options: [
      'Akun jadi lebih aman',
      'Orang lain bisa menggunakan data kita untuk kejahatan',
      'Followers bertambah',
      'Postingan menjadi viral'
    ],
    correct: 1
  },
  {
    id: 10,
    category: 'Tips',
    question: 'Apa yang harus dilakukan jika menerima pesan mencurigakan?',
    options: [
      'Langsung klik tautan yang diberikan',
      'Balas dengan informasi pribadi',
      'Jangan klik tautan, laporkan sebagai spam/phishing',
      'Abaikan saja tanpa tindakan'
    ],
    correct: 2
  }
];

// ---- STATE ----
let currentQuestion = 0;
let score = 0;
let answered = false;
let userAnswers = [];

// ---- DOM ----
const els = {
  qCounter: document.getElementById('qCounter'),
  qTag: document.getElementById('qTag'),
  scoreBadge: document.getElementById('scoreBadge'),
  progressFill: document.getElementById('progressFill'),
  progressLabel: document.getElementById('progressLabel'),
  qNumber: document.getElementById('qNumber'),
  qCategory: document.getElementById('qCategory'),
  questionText: document.getElementById('questionText'),
  optionsGrid: document.getElementById('optionsGrid'),
  nextBtn: document.getElementById('nextBtn'),
  questionCard: document.getElementById('questionCard'),
  resultCard: document.getElementById('resultCard'),
  finalScore: document.getElementById('finalScore'),
  resultIcon: document.getElementById('resultIcon'),
  resultTitle: document.getElementById('resultTitle'),
  resultMessage: document.getElementById('resultMessage'),
  resultDetail: document.getElementById('resultDetail')
};

// ---- FUNGSI ----
function loadQuestion(index) {
  const q = quizData[index];
  answered = false;
  els.nextBtn.disabled = true;

  // Status
  els.qCounter.textContent = `Pertanyaan ${index + 1} / ${quizData.length}`;
  els.qTag.textContent = q.category;
  els.scoreBadge.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    Skor: ${score}
  `;

  // Progress
  const progress = (index / quizData.length) * 100;
  els.progressFill.style.width = `${progress}%`;
  els.progressLabel.textContent = `${Math.round(progress)}%`;

  // Question
  els.qNumber.textContent = `Q${index + 1}`;
  els.qCategory.textContent = q.category;
  els.questionText.textContent = q.question;

  // Options
  const labels = ['A', 'B', 'C', 'D'];
  els.optionsGrid.innerHTML = '';

  q.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `
      <span class="option-label">${labels[i]}</span>
      <span class="option-text">${option}</span>
    `;
    btn.dataset.index = i;
    btn.addEventListener('click', () => selectOption(i));
    els.optionsGrid.appendChild(btn);
  });

  // Show question, hide result
  els.questionCard.style.display = 'block';
  els.resultCard.style.display = 'none';

  // Animasi masuk
  els.questionCard.style.animation = 'none';
  requestAnimationFrame(() => {
    els.questionCard.style.animation = 'slide-up 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
  });
}

function selectOption(index) {
  if (answered) return;

  const q = quizData[currentQuestion];
  const buttons = els.optionsGrid.querySelectorAll('.option-btn');
  const isCorrect = index === q.correct;

  // Disable all
  buttons.forEach(btn => btn.classList.add('disabled'));

  // Highlight
  buttons.forEach((btn, i) => {
    if (i === index) btn.classList.add('selected');
    if (i === q.correct) btn.classList.add('correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  // Update score
  if (isCorrect) {
    score += 10;
    els.scoreBadge.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      Skor: ${score}
    `;
  }

  userAnswers.push({
    questionIndex: currentQuestion,
    selected: index,
    correct: q.correct,
    isCorrect: isCorrect
  });

  answered = true;
  els.nextBtn.disabled = false;

  // Update progress setelah jawab
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  els.progressFill.style.width = `${progress}%`;
  els.progressLabel.textContent = `${Math.round(progress)}%`;
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion(currentQuestion);
  } else {
    showResult();
  }
}

function showResult() {
  els.questionCard.style.display = 'none';
  els.resultCard.style.display = 'block';

  // Progress 100%
  els.progressFill.style.width = '100%';
  els.progressLabel.textContent = '100%';

  // Hitung persentase
  const total = quizData.length * 10;
  const percentage = Math.round((score / total) * 100);

  els.finalScore.textContent = percentage;

  // Tentukan pesan
  let icon = '';
  let title = '';
  let message = '';
  let detail = '';

  if (percentage >= 80) {
    icon = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#3DDBD9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    title = '🌟 Luar Biasa!';
    message = 'Kamu sangat paham tentang keamanan digital!';
    detail = 'Terus pertahankan kesadaran privasimu. Kamu adalah contoh yang baik untuk orang lain.';
  } else if (percentage >= 60) {
    icon = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#F2A6BB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
    title = '👍 Cukup Baik!';
    message = 'Kamu sudah memiliki dasar yang kuat tentang privasi digital.';
    detail = 'Pelajari lebih dalam untuk melindungi diri lebih maksimal.';
  } else if (percentage >= 40) {
    icon = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FAC8B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    title = '📖 Masih Belajar';
    message = 'Kamu sudah mulai memahami, tapi masih perlu banyak belajar.';
    detail = 'Jangan khawatir, kunjungi halaman Edukasi kami untuk belajar lebih lanjut!';
  } else {
    icon = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#E06A7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    title = '🌱 Perlu Belajar Lagi';
    message = 'Privasi digital itu penting! Saatnya meningkatkan kesadaran.';
    detail = 'Yuk, pelajari dasar-dasar keamanan digital di halaman Edukasi kami.';
  }

  els.resultIcon.innerHTML = icon;
  els.resultTitle.textContent = title;
  els.resultMessage.textContent = message;
  els.resultDetail.textContent = detail;

  // Animasi score circle muncul
  const circle = document.querySelector('.score-circle-big');
  circle.style.transform = 'scale(0.8)';
  circle.style.opacity = '0';
  setTimeout(() => {
    circle.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    circle.style.transform = 'scale(1)';
    circle.style.opacity = '1';
  }, 200);

  // Update status
  els.qCounter.textContent = `Selesai!`;
  els.qTag.textContent = '🏁';
  els.scoreBadge.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    Skor: ${score}
  `;
}

// ---- EVENT ----
els.nextBtn.addEventListener('click', nextQuestion);

// ---- KEYBOARD SUPPORT ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !els.nextBtn.disabled && els.questionCard.style.display !== 'none') {
    els.nextBtn.click();
  }
  if (e.key >= '1' && e.key <= '4' && !answered && els.questionCard.style.display !== 'none') {
    const index = parseInt(e.key) - 1;
    const buttons = els.optionsGrid.querySelectorAll('.option-btn');
    if (buttons[index] && !buttons[index].classList.contains('disabled')) {
      selectOption(index);
    }
  }
});

// ---- INIT ----
loadQuestion(0);
console.log('✦ ShareWise Quiz — loaded! Good luck! ✦');