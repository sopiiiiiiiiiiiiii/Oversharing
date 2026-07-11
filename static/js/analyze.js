// ============================================================
// ANALYZE — Premium Interaktif
// ============================================================

// ---- DATA PATTERNS ----
const patterns = {
  phone: {
    regex: /(\+?62|0)[\s-]?8[1-9][\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}/gi,
    label: 'Nomor Telepon',
    risk: 25
  },
  email: {
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    label: 'Alamat Email',
    risk: 20
  },
  address: {
    regex: /(Jl\.?|Jalan|Gg\.?|Gang|Kp\.?|Kampung|Perum|Perumahan|Apartemen|Kav\.?|Komplek)[\s-]?\w+[\s-]?\w*/gi,
    label: 'Alamat Rumah',
    risk: 30
  },
  date: {
    regex: /\b\d{1,2}\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/gi,
    label: 'Tanggal Penting',
    risk: 15
  },
  location: {
    regex: /(lagi|sedang|di)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?(?!\s+(Bali|Jakarta|Bandung|Surabaya|Yogyakarta|Semarang|Medan|Makassar))/gi,
    label: 'Indikasi Lokasi',
    risk: 15
  },
  travel: {
    regex: /(liburan|jalan-jalan|pergi|ke\s+)[A-Z][a-z]+(\s+[A-Z][a-z]+)?\s*(Bali|Jakarta|Bandung|Lombok|Yogyakarta|Malang|Surabaya)/gi,
    label: 'Rencana Perjalanan',
    risk: 20
  },
  profanity: {
    regex: /(anjing|bangsat|kntl|memek|jancok|asu|ndas|tolol|goblok|bego|idiot|dungu|brengsek|sialan|anj|kontol)/gi,
    label: 'Kata Kasar',
    risk: 10
  }
};

// ---- STATE ----
let currentResult = null;
let historyData = [];
let isAnalyzing = false;

// ---- DOM ----
const els = {
  inputText: document.getElementById('inputText'),
  charCount: document.getElementById('charCount'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  clearBtn: document.getElementById('clearBtn'),
  errorMsg: document.getElementById('errorMsg'),
  placeholderState: document.getElementById('placeholderState'),
  loadingState: document.getElementById('loadingState'),
  resultContent: document.getElementById('resultContent'),
  riskScore: document.getElementById('riskScore'),
  riskStatus: document.getElementById('riskStatus'),
  riskDesc: document.getElementById('riskDesc'),
  findingsList: document.getElementById('findingsList'),
  sentimentLabel: document.getElementById('sentimentLabel'),
  sentimentFill: document.getElementById('sentimentFill'),
  safeVersion: document.getElementById('safeVersion'),
  copySafeBtn: document.getElementById('copySafeBtn'),
  totalAnalyses: document.getElementById('totalAnalyses'),
  totalFindings: document.getElementById('totalFindings'),
  avgRisk: document.getElementById('avgRisk'),
  historyList: document.getElementById('historyList'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn')
};

// ---- FUNGSI ANALISIS ----
function analyzeText(text) {
  const findings = [];
  let totalRisk = 0;
  let redactedText = text;

  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern.regex);
    if (matches && matches.length > 0) {
      matches.forEach(match => {
        findings.push({
          type: pattern.label,
          value: match,
          risk: pattern.risk
        });
        totalRisk += pattern.risk;
        redactedText = redactedText.replace(match, '[▸▸▸]');
      });
    }
  }

  let riskScore = Math.min(totalRisk, 100);
  if (findings.length >= 3) riskScore = Math.min(riskScore + 10, 100);
  if (findings.length >= 5) riskScore = Math.min(riskScore + 10, 100);

  // Sentimen
  const positiveWords = ['senang', 'bahagia', 'suka', 'asyik', 'seru', 'bagus', 'hebat', 'luar biasa', 'mantap', 'happy', 'great', 'good', 'nice', 'wonderful', 'amazing'];
  const negativeWords = ['sedih', 'kecewa', 'marah', 'buruk', 'jelek', 'menyedihkan', 'frustasi', 'stress', 'kesal', 'sakit', 'bad', 'sad', 'angry', 'upset', 'terrible'];

  let positiveCount = 0, negativeCount = 0;
  positiveWords.forEach(w => { if (text.toLowerCase().includes(w)) positiveCount++; });
  negativeWords.forEach(w => { if (text.toLowerCase().includes(w)) negativeCount++; });

  let sentiment = 'neutral';
  let sentimentPercent = 50;
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    sentimentPercent = Math.min(50 + (positiveCount * 8), 90);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    sentimentPercent = Math.max(50 - (negativeCount * 8), 10);
  }

  let status = 'low';
  let statusLabel = '✅ Aman';
  let statusColor = 'low';
  let description = 'Teks ini tampaknya aman untuk dibagikan.';

  if (riskScore >= 70) {
    status = 'high';
    statusLabel = '⚠️ Risiko Tinggi';
    statusColor = 'high';
    description = 'Teks ini mengandung banyak informasi sensitif. Sebaiknya diedit sebelum diposting.';
  } else if (riskScore >= 40) {
    status = 'medium';
    statusLabel = '⚡ Risiko Sedang';
    statusColor = 'medium';
    description = 'Ada beberapa informasi yang perlu diperhatikan. Periksa kembali teks Anda.';
  }

  return {
    findings,
    riskScore,
    status,
    statusLabel,
    statusColor,
    description,
    sentiment,
    sentimentPercent,
    redactedText,
    hasFindings: findings.length > 0,
    wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
    charCount: text.length
  };
}

// ---- RENDER ----
function renderResult(result) {
  currentResult = result;

  els.placeholderState.style.display = 'none';
  els.loadingState.style.display = 'none';
  els.resultContent.style.display = 'block';

  // Score
  els.riskScore.textContent = result.riskScore;
  els.riskStatus.textContent = result.statusLabel;
  els.riskStatus.className = `score-status ${result.statusColor}`;
  els.riskDesc.textContent = result.description;

  // Findings
  const list = els.findingsList;
  list.innerHTML = '';
  if (result.findings.length === 0) {
    list.innerHTML = '<p class="no-findings">Tidak ada temuan sensitif.</p>';
  } else {
    result.findings.forEach(f => {
      const item = document.createElement('div');
      item.className = 'finding-item';
      item.innerHTML = `
        <span class="finding-type">${f.type}</span>
        <span class="finding-value">"${f.value}"</span>
      `;
      list.appendChild(item);
    });
  }

  // Sentiment
  const labels = { positive: 'Positif 😊', neutral: 'Netral 😐', negative: 'Negatif 😟' };
  els.sentimentLabel.textContent = labels[result.sentiment] || 'Netral';
  els.sentimentFill.style.width = `${result.sentimentPercent}%`;
  els.sentimentFill.className = `sentiment-fill ${result.sentiment}`;

  // Safe version
  els.safeVersion.innerHTML = `
    <p>${result.redactedText}</p>
    ${result.findings.length > 0 ? `<p>Informasi sensitif telah disensor.</p>` : ''}
  `;

  // Save history
  saveToHistory(result);
}

// ---- HISTORY ----
function loadHistory() {
  try {
    const data = localStorage.getItem('sharewise_history');
    historyData = data ? JSON.parse(data) : [];
  } catch { historyData = []; }
  renderHistory();
  updateStats();
}

function saveToHistory(result) {
  const entry = {
    id: Date.now(),
    text: els.inputText.value.slice(0, 50) + (els.inputText.value.length > 50 ? '...' : ''),
    score: result.riskScore,
    status: result.status,
    findings: result.findings.length,
    timestamp: new Date().toLocaleString('id-ID')
  };
  historyData.unshift(entry);
  if (historyData.length > 20) historyData.pop();
  try { localStorage.setItem('sharewise_history', JSON.stringify(historyData)); } catch {}
  renderHistory();
  updateStats();
}

function renderHistory() {
  const list = els.historyList;
  if (historyData.length === 0) {
    list.innerHTML = '<p class="empty-state">Belum ada riwayat analisis.</p>';
    return;
  }
  list.innerHTML = '';
  historyData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <span class="history-text">${item.text}</span>
      <span class="history-score ${item.status}">${item.score}</span>
      <span class="history-time">${item.timestamp}</span>
    `;
    list.appendChild(div);
  });
}

function clearHistory() {
  if (historyData.length === 0) return;
  if (confirm('Hapus semua riwayat analisis?')) {
    historyData = [];
    localStorage.removeItem('sharewise_history');
    renderHistory();
    updateStats();
  }
}

function updateStats() {
  const total = historyData.length;
  const totalFindings = historyData.reduce((sum, h) => sum + h.findings, 0);
  const avgScore = total > 0 ? Math.round(historyData.reduce((sum, h) => sum + h.score, 0) / total) : 0;
  els.totalAnalyses.textContent = total;
  els.totalFindings.textContent = totalFindings;
  els.avgRisk.textContent = `${avgScore}%`;
}

// ---- COUNTER ----
function updateCharCounter() {
  const count = els.inputText.value.length;
  els.charCount.textContent = count;
  const counter = document.querySelector('.input-counter');
  if (count > 500) {
    counter.classList.add('warning');
  } else {
    counter.classList.remove('warning');
  }
}

// ---- ANALYZE ACTION ----
function performAnalysis() {
  const text = els.inputText.value.trim();

  if (!text) {
    els.errorMsg.textContent = 'Masukkan teks terlebih dahulu!';
    els.errorMsg.style.display = 'block';
    setTimeout(() => { els.errorMsg.style.display = 'none'; }, 3000);
    return;
  }

  if (isAnalyzing) return;
  isAnalyzing = true;

  els.errorMsg.style.display = 'none';
  els.placeholderState.style.display = 'none';
  els.resultContent.style.display = 'none';
  els.loadingState.style.display = 'flex';

  els.analyzeBtn.disabled = true;
  els.analyzeBtn.innerHTML = `
    <div class="loader" style="width:18px;height:18px;border-width:2px;"></div>
    <span>Menganalisis...</span>
  `;

  setTimeout(() => {
    const result = analyzeText(text);
    renderResult(result);
    isAnalyzing = false;
    els.analyzeBtn.disabled = false;
    els.analyzeBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <span>Analisis Sekarang</span>
    `;
  }, 600);
}

// ---- EVENT LISTENERS ----
els.analyzeBtn.addEventListener('click', performAnalysis);

els.clearBtn.addEventListener('click', () => {
  els.inputText.value = '';
  updateCharCounter();
  els.errorMsg.style.display = 'none';
  els.placeholderState.style.display = 'flex';
  els.loadingState.style.display = 'none';
  els.resultContent.style.display = 'none';
});

els.inputText.addEventListener('input', updateCharCounter);

els.inputText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    performAnalysis();
  }
});

els.copySafeBtn.addEventListener('click', () => {
  const text = els.safeVersion.querySelector('p')?.textContent || '';
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      const original = els.copySafeBtn.innerHTML;
      els.copySafeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3DDBD9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Tersalin!
      `;
      setTimeout(() => { els.copySafeBtn.innerHTML = original; }, 1500);
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Teks berhasil disalin!');
    });
  }
});

els.clearHistoryBtn.addEventListener('click', clearHistory);

// ---- AUTO ANALYZE ----
setTimeout(() => {
  performAnalysis();
}, 400);

// ---- INIT ----
loadHistory();
updateCharCounter();
console.log('✦ ShareWise Analyze — loaded! ✦');
// ============================================================
// ANALYZE — Pola Deteksi Premium (Lengkap)
// ============================================================

const patterns = {
  // ---- 1. Kontak Pribadi ----
  phone: {
    regex: /(\+?62|0)[\s-]?8[1-9][\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}/gi,
    label: '📱 Nomor Telepon',
    risk: 25,
    icon: '📱'
  },
  email: {
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    label: '✉️ Alamat Email',
    risk: 20,
    icon: '✉️'
  },

  // ---- 2. Alamat & Lokasi ----
  address: {
    regex: /(Jl\.?|Jalan|Gg\.?|Gang|Kp\.?|Kampung|Perum|Perumahan|Apartemen|Kav\.?|Komplek|RT|RW|Desa|Kelurahan|Kecamatan)[\s-]?\w+[\s-]?\w*/gi,
    label: '🏠 Alamat Rumah',
    risk: 30,
    icon: '🏠'
  },
  location: {
    regex: /(lagi|sedang|di)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?(?!\s+(Bali|Jakarta|Bandung|Surabaya|Yogyakarta|Semarang|Medan|Makassar))/gi,
    label: '📍 Indikasi Lokasi',
    risk: 15,
    icon: '📍'
  },

  // ---- 3. Identitas Pribadi (BARU!) ----
  nik: {
    regex: /\b[0-9]{16}\b/g,
    label: '🆔 NIK (KTP)',
    risk: 35,
    icon: '🆔'
  },
  fullName: {
    regex: /\b(Nama saya|Nama ku|Namaku|saya|aku)\s+([A-Z][a-z]+(\s+[A-Z][a-z]+)?)\b/gi,
    label: '👤 Nama Lengkap',
    risk: 20,
    icon: '👤'
  },
  parentName: {
    regex: /\b(Ibu|Bapak|Ayah|Mama|Papa|Orang tua)\s+([A-Z][a-z]+(\s+[A-Z][a-z]+)?)\b/gi,
    label: '👨‍👩‍👧 Nama Orang Tua',
    risk: 25,
    icon: '👨‍👩‍👧'
  },

  // ---- 4. Keuangan & Dokumen (BARU!) ----
  bankAccount: {
    regex: /\b[0-9]{10,16}\b/g,
    label: '💳 Nomor Rekening',
    risk: 30,
    icon: '💳'
  },
  creditCard: {
    regex: /\b(4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g,
    label: '💳 Nomor Kartu Kredit',
    risk: 40,
    icon: '💳'
  },

  // ---- 5. Kendaraan (BARU!) ----
  licensePlate: {
    regex: /\b[B-DEF-GHI-JK-LM-NP-RST-UV-WXYZ]{1,2}\s?[0-9]{1,4}\s?[B-DEF-GHI-JK-LM-NP-RST-UV-WXYZ]{1,3}\b/gi,
    label: '🚗 Plat Nomor',
    risk: 15,
    icon: '🚗'
  },

  // ---- 6. Teknis (BARU!) ----
  ipAddress: {
    regex: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
    label: '🌐 Alamat IP',
    risk: 10,
    icon: '🌐'
  },
  dateOfBirth: {
    regex: /\b\d{1,2}\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/gi,
    label: '📅 Tanggal Lahir',
    risk: 25,
    icon: '📅'
  },

  // ---- 7. Perjalanan & Aktivitas ----
  travel: {
    regex: /(liburan|jalan-jalan|pergi|ke\s+)[A-Z][a-z]+(\s+[A-Z][a-z]+)?\s*(Bali|Jakarta|Bandung|Lombok|Yogyakarta|Malang|Surabaya|Luar Negeri|Eropa|Amerika|Asia)/gi,
    label: '✈️ Rencana Perjalanan',
    risk: 20,
    icon: '✈️'
  },
  vacantHome: {
    regex: /(rumah kosong|sedang pergi|liburan|kosong|ditinggal|pergi\s+(?:ke|jalan))/gi,
    label: '🏚️ Indikasi Rumah Kosong',
    risk: 30,
    icon: '🏚️'
  },

  // ---- 8. Kata Kasar ----
  profanity: {
    regex: /(anjing|bangsat|kntl|memek|jancok|asu|ndas|tolol|goblok|bego|idiot|dungu|brengsek|sialan|anj|kontol|fuck|shit|bitch|asshole)/gi,
    label: '⚠️ Kata Kasar',
    risk: 10,
    icon: '⚠️'
  }
};