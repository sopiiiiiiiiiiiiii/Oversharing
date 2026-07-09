// ============================================================
// QUIZ — Data pertanyaan
// ============================================================

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

// ============================================================
// QUIZ — State & logika
// ============================================================

let currentQuestion = 0;
let score = 0;
let answered = false;
let userAnswers = [];

const elements = {
  qCounter: document.getElementById('qCounter'),
  qTag: document.getElementById('qTag'),
  scoreBadge: document.getElementById('scoreBadge'),
  progressFill: document.getElementById('progressFill'),
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

// ============================================================
// FUNGSI UTAMA
// ============================================================

function loadQuestion(index) {
  const q = quizData[index];
  answered = false;
  elements.nextBtn.disabled = true;

  // Update status
  elements.qCounter.textContent = `Pertanyaan ${index + 1} / ${quizData.length}`;
  elements.qTag.textContent = `✦ ${q.category}`;
  elements.scoreBadge.textContent = `✦ Skor: ${score}`;
  elements.progressFill.style.width = `${((index) / quizData.length) * 100}%`;

  // Update question
  elements.qNumber.textContent = `Q${index + 1}`;
  elements.qCategory.textContent = q.category;
  elements.questionText.textContent = q.question;

  // Generate options
  const labels = ['A', 'B', 'C', 'D'];
  elements.optionsGrid.innerHTML = '';

  q.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-label">${labels[i]}</span> ${option}`;
    btn.dataset.index = i;
    btn.addEventListener('click', () => selectOption(i));
    elements.optionsGrid.appendChild(btn);
  });

  // Show question, hide result
  elements.questionCard.style.display = 'block';
  elements.resultCard.style.display = 'none';

  // Update progress after question loads
  setTimeout(() => {
    elements.progressFill.style.width = `${((index + 1) / quizData.length) * 100}%`;
  }, 50);
}

function selectOption(index) {
  if (answered) return;

  const q = quizData[currentQuestion];
  const buttons = elements.optionsGrid.querySelectorAll('.option-btn');

  // Disable all buttons
  buttons.forEach(btn => btn.classList.add('disabled'));

  // Highlight selected
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('selected');
    }
  });

  // Check answer
  const isCorrect = index === q.correct;
  if (isCorrect) {
    score += 10;
    buttons[index].classList.add('correct');
  } else {
    buttons[index].classList.add('wrong');
    // Show correct answer
    buttons[q.correct].classList.add('correct');
  }

  userAnswers.push({
    questionIndex: currentQuestion,
    selected: index,
    correct: q.correct,
    isCorrect: isCorrect
  });

  answered = true;
  elements.nextBtn.disabled = false;
  elements.scoreBadge.textContent = `✦ Skor: ${score}`;
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
  elements.questionCard.style.display = 'none';
  elements.resultCard.style.display = 'block';
  elements.progressFill.style.width = '100%';

  // Hitung persentase
  const total = quizData.length * 10;
  const percentage = Math.round((score / total) * 100);

  elements.finalScore.textContent = percentage;

  // Tentukan pesan berdasarkan skor
  let icon = '✦';
  let title = '';
  let message = '';
  let detail = '';

  if (percentage >= 80) {
    icon = '✦';
    title = '🌟 Luar Biasa!';
    message = 'Kamu sangat paham tentang keamanan digital!';
    detail = 'Terus pertahankan kesadaran privasimu. Kamu adalah contoh yang baik!';
  } else if (percentage >= 60) {
    icon = '✦';
    title = '👍 Cukup Baik!';
    message = 'Kamu sudah memiliki dasar yang kuat tentang privasi digital.';
    detail = 'Pelajari lebih dalam untuk melindungi diri lebih maksimal.';
  } else if (percentage >= 40) {
    icon = '✦';
    title = '📖 Masih Belajar';
    message = 'Kamu sudah mulai memahami, tapi masih perlu banyak belajar.';
    detail = 'Jangan khawatir, kunjungi halaman Edukasi kami untuk belajar lebih lanjut!';
  } else {
    icon = '✦';
    title = '🌱 Perlu Belajar Lagi';
    message = 'Privasi digital itu penting! Saatnya meningkatkan kesadaran.';
    detail = 'Yuk, pelajari dasar-dasar keamanan digital di halaman Edukasi kami.';
  }

  elements.resultIcon.textContent = icon;
  elements.resultTitle.textContent = title;
  elements.resultMessage.textContent = message;
  elements.resultDetail.textContent = detail;

  // Update score badge
  elements.scoreBadge.textContent = `✦ Skor: ${score}`;
}

// ============================================================
// EVENT LISTENERS
// ============================================================

elements.nextBtn.addEventListener('click', nextQuestion);

// ============================================================
// INISIALISASI
// ============================================================

// Load pertanyaan pertama
loadQuestion(0);

// Log friendly
console.log('✦ ShareWise — Quiz loaded! Good luck! ✦');