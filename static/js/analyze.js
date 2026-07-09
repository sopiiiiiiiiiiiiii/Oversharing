// ============================================================
// ANALYZE — Deteksi & analisis teks
// ============================================================

// ============================================================
// DATA SENSITIF — pola deteksi
// ============================================================

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
    regex: /(Jl\.?|Jalan|Gg\.?|Gang|Kp\.?|Kampung|Perum|Perumahan|Apartemen|Kav\.?|Komplek)[\s-]?\w+[\s-]?\w*[\s-]?\w*/gi,
    label: 'Alamat Rumah',
    risk: 30
  },
  date: {
    regex: /\b\d{1,2}\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/gi,
    label: 'Tanggal Penting',
    risk: 15
  },
  location: {
    regex: /(lagi|sedang|di)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\s*(?!\s+(Bali|Jakarta|Bandung|Surabaya|Yogyakarta|Semarang|Medan|Makassar))/gi,
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

// ============================================================
// STATE
// ============================================================

let currentResult = null;
let historyData = [];

// ============================================================
// DOM ELEMENTS
// ============================================================

const elements = {
  inputText: document.getElementById('inputText'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  clearBtn: document.getElementById('clearBtn'),
  errorMsg: document.getElementById('errorMsg'),
  placeholderState: document.getElementById('placeholderState'),
  resultContent: document.getElementById('resultContent'),
  riskScore: document.getElementById('riskScore'),
  riskStatus: document.getElementById('riskStatus'),
  riskDesc: document.getElementById('riskDesc'),
  findingsList: document.getElementById('findingsList'),
  sentimentDisplay: document.getElementById('sentimentDisplay'),
  sentimentFill: document.getElementById('sentimentFill'),
  safeVersion: document.getElementById('safeVersion'),
  copySafeBtn: document.getElementById('copySafeBtn'),
  totalAnalyses: document.getElementById('totalAnalyses'),
  totalFindings: document.getElementById('totalFindings'),
  avgRisk: document.getElementById('avgRisk'),
  historyList: document.getElementById('historyList'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn')
};

// ============================================================
// FUNGSI UTAMA
// ============================================================

function analyzeText(text) {
  const findings = [];
  let totalRisk = 0;
  let hasFindings = false;
  let redactedText = text;

  // Deteksi setiap pola
  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern.regex);
    if (matches && matches.length > 0) {
      hasFindings = true;
      matches.forEach(match => {
        findings.push({
          type: pattern.label,
          value: match,
          risk: pattern.risk
        });
        totalRisk += pattern.risk;
        // Redact
        redactedText = redactedText.replace(match, '[▸▸▸]');
      });
    }
  }

  // Hitung skor risiko (maks 100)
  let riskScore = Math.min(totalRisk, 100);

  // Tambahkan bonus jika ada banyak temuan
  if (findings.length >= 3) riskScore = Math.min(riskScore + 10, 100);
  if (findings.length >= 5) riskScore = Math.min(riskScore + 10, 100);

  // Analisis sentimen sederhana (berdasarkan kata positif/negatif)
  const positiveWords = ['senang', 'bahagia', 'suka', 'asyik', 'seru', 'bagus', 'hebat', 'luar biasa', 'mantap', 'happy', 'great', 'good', 'nice', 'wonderful', 'amazing'];
  const negativeWords = ['sedih', 'kecewa', 'marah', 'buruk', 'jelek', 'menyedihkan', 'frustasi', 'stress', 'kesal', 'sakit', 'bad', 'sad', 'angry', 'upset', 'terrible'];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    if (text.toLowerCase().includes(word)) positiveCount++;
  });

  negativeWords.forEach(word => {
    if (text.toLowerCase().includes(word)) negativeCount++;
  });

  let sentiment = 'neutral';
  let sentimentPercent = 50;

  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    sentimentPercent = Math.min(50 + (positiveCount * 8), 90);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    sentimentPercent = Math.max(50 - (negativeCount * 8), 10);
  }

  // Status risiko
  let status = 'low';
  let statusLabel = 'Aman';
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
  } else {
    status = 'low';
    statusLabel = '✅ Aman';
    statusColor = 'low';
    description = 'Teks ini tampaknya aman untuk dibagikan.';
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
    hasFindings,
    wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
    charCount: text.length
  };
}

// ============================================================
// RENDER HASIL
// ============================================================

function renderResult(result) {
  currentResult = result;

  // Sembunyikan placeholder, tampilkan hasil
  elements.placeholderState.style.display = 'none';
  elements.resultContent.style.display = 'block';

  // Score
  elements.riskScore.textContent = result.riskScore;
  elements.riskStatus.textContent = result.statusLabel;
  elements.riskStatus.className = `score-status ${result.statusColor}`;
  elements.riskDesc.textContent = result.description;

  // Findings
  const findingsList = elements.findingsList;
  findingsList.innerHTML = '';

  if (result.findings.length === 0) {
    findingsList.innerHTML = '<p class="no-findings">✦ Tidak ada temuan sensitif.</p>';
  } else {
    result.findings.forEach(f => {
      const item = document.createElement('div');
      item.className = 'finding-item';
      item.innerHTML = `
        <span class="finding-type">${f.type}</span>
        <span class="finding-value">"${f.value}"</span>
      `;
      findingsList.appendChild(item);
    });
  }

  // Sentiment
  const sentimentLabels = {
    positive: 'Positif 😊',
    neutral: 'Netral 😐',
    negative: 'Negatif 😟'
  };
  const sentimentEl = elements.sentimentDisplay.querySelector('.sentiment-label');
  if (sentimentEl) {
    sentimentEl.textContent = sentimentLabels[result.sentiment] || 'Netral';
  }

  const fill = elements.sentimentFill;
  fill.style.width = `${result.sentimentPercent}%`;
  fill.className = `sentiment-fill ${result.sentiment}`;

  // Safe version
  elements.safeVersion.innerHTML = `
    <p>${result.redactedText}</p>
    ${result.findings.length > 0 ? `<p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.3rem;">✦ Informasi sensitif telah disensor.</p>` : ''}
  `;

  // Simpan ke riwayat
  saveToHistory(result);
}

// ============================================================
// RIWAYAT (localStorage)
// ============================================================

function loadHistory() {
  try {
    const data = localStorage.getItem('sharewise_history');
    if (data) {
      historyData = JSON.parse(data);
    }
  } catch (e) {
    historyData = [];
  }
  renderHistory();
  updateStats();
}

function saveToHistory(result) {
  const entry = {
    id: Date.now(),
    text: elements.inputText.value.slice(0, 60) + (elements.inputText.value.length > 60 ? '...' : ''),
    score: result.riskScore,
    status: result.status,
    findings: result.findings.length,
    timestamp: new Date().toLocaleString('id-ID')
  };

  historyData.unshift(entry);
  if (historyData.length > 20) historyData.pop();

  try {
    localStorage.setItem('sharewise_history', JSON.stringify(historyData));
  } catch (e) {
    // ignore
  }

  renderHistory();
  updateStats();
}

function renderHistory() {
  const list = elements.historyList;

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

// ============================================================
// STATISTIK
// ============================================================

function updateStats() {
  const total = historyData.length;
  const totalFindings = historyData.reduce((sum, h) => sum + h.findings, 0);
  const avgScore = total > 0
    ? Math.round(historyData.reduce((sum, h) => sum + h.score, 0) / total)
    : 0;

  elements.totalAnalyses.textContent = total;
  elements.totalFindings.textContent = totalFindings;
  elements.avgRisk.textContent = `${avgScore}%`;
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Analisis
elements.analyzeBtn.addEventListener('click', () => {
  const text = elements.inputText.value.trim();

  if (!text) {
    elements.errorMsg.textContent = '✦ Masukkan teks terlebih dahulu!';
    elements.errorMsg.style.display = 'block';
    return;
  }

  elements.errorMsg.style.display = 'none';

  // Animasi tombol
  elements.analyzeBtn.innerHTML = '<span>✦ Memproses...</span>';
  elements.analyzeBtn.disabled = true;

  setTimeout(() => {
    const result = analyzeText(text);
    renderResult(result);

    elements.analyzeBtn.innerHTML = '<span>✦ Analisis Sekarang</span>';
    elements.analyzeBtn.disabled = false;
  }, 400);
});

// Enter key (Ctrl+Enter)
elements.inputText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    elements.analyzeBtn.click();
  }
});

// Clear
elements.clearBtn.addEventListener('click', () => {
  elements.inputText.value = '';
  elements.errorMsg.style.display = 'none';
  elements.placeholderState.style.display = 'flex';
  elements.resultContent.style.display = 'none';
});

// Copy safe version
elements.copySafeBtn.addEventListener('click', () => {
  const text = elements.safeVersion.querySelector('p')?.textContent || '';
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      const original = elements.copySafeBtn.textContent;
      elements.copySafeBtn.textContent = '✦ Tersalin!';
      setTimeout(() => {
        elements.copySafeBtn.textContent = original;
      }, 1500);
    }).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('✦ Teks berhasil disalin!');
    });
  }
});

// Clear history
elements.clearHistoryBtn.addEventListener('click', clearHistory);

// ============================================================
// INISIALISASI
// ============================================================

loadHistory();

// Log friendly
console.log('✦ ShareWise — Analyze page loaded! Stay safe online ✦');

// Auto-analyze contoh (opsional)
// Uncomment untuk auto-analyze teks contoh saat halaman dimuat
/*
setTimeout(() => {
  elements.analyzeBtn.click();
}, 500);
*/