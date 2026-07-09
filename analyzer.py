import re
from typing import List, Dict

# Bobot risiko tiap kategori (0-100)
RISK_WEIGHTS = {
    'Email': 40,
    'Phone Number': 50,
    'NIK': 80,
    'Credit Card': 90,
    'IP Address': 30,
    'URL': 10,
    'Location': 45,
    'Oversharing Keyword': 35,
}

# Pola deteksi regex
PATTERNS = {
    'Email': r'\b[\w\.-]+@[\w\.-]+\.\w{2,}\b',
    'Phone Number': r'\b(?:\+62|62|0)8[1-9][0-9]{6,10}\b',
    'NIK': r'\b\d{16}\b',
    'Credit Card': r'\b(?:\d[ -]*?){13,16}\b',
    'IP Address': r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
    'URL': r'https?://[^\s]+',
}

# Kata kunci oversharing (case insensitive)
OVERSHARING_KEYWORDS = [
    'rumah kosong', 'sendirian di rumah', 'pergi ke luar kota', 'password saya',
    'nomor rekening', 'ibu kandung', 'tanggal lahir', 'sedang di', 'tiket pesawat',
    'boarding pass', 'kunci rumah', 'safe word', 'pin atm', 'kode otp',
]

def analyze_text(text: str) -> Dict:
    """Analisis teks dan kembalikan temuan, skor, rekomendasi, dan teks yang sudah disensor."""
    findings = []
    total_risk = 0

    # Deteksi pola regex
    for category, pattern in PATTERNS.items():
        for match in re.finditer(pattern, text):
            findings.append({
                'type': category,
                'value': match.group(),
                'start': match.start(),
                'end': match.end(),
                'weight': RISK_WEIGHTS.get(category, 20)
            })
            total_risk += RISK_WEIGHTS.get(category, 20)

    # Deteksi kata kunci oversharing
    text_lower = text.lower()
    for keyword in OVERSHARING_KEYWORDS:
        for match in re.finditer(re.escape(keyword), text_lower):
            findings.append({
                'type': 'Oversharing Keyword',
                'value': match.group(),
                'start': match.start(),
                'end': match.end(),
                'weight': RISK_WEIGHTS['Oversharing Keyword']
            })
            total_risk += RISK_WEIGHTS['Oversharing Keyword']

    # Urutkan berdasarkan posisi kemunculan
    findings.sort(key=lambda x: x['start'])

    # Batasi skor maksimal 100
    score = min(total_risk, 100)

    # Tentukan level risiko
    if score >= 70:
        risk_level = 'high'
    elif score >= 30:
        risk_level = 'medium'
    else:
        risk_level = 'low'

    return {
        'findings': findings,
        'score': score,
        'risk_level': risk_level,
        'recommendations': generate_recommendations(findings),
        'redacted_text': redact_text(text, findings)
    }

def generate_recommendations(findings: List[Dict]) -> List[str]:
    """Buat daftar rekomendasi unik berdasarkan jenis temuan."""
    recs = set()
    types_found = {f['type'] for f in findings}

    if 'Phone Number' in types_found:
        recs.add('Hapus nomor telepon dari postingan publik.')
    if 'Email' in types_found:
        recs.add('Jangan tampilkan alamat email secara terbuka.')
    if 'NIK' in types_found:
        recs.add('NIK adalah data identitas sangat sensitif. Segera hapus!')
    if 'Credit Card' in types_found:
        recs.add('Data kartu kredit sangat rawan dieksploitasi. Hapus segera!')
    if 'IP Address' in types_found:
        recs.add('Alamat IP dapat melacak lokasi atau jaringan Anda.')
    if 'URL' in types_found:
        recs.add('Pastikan link yang dibagikan tidak mengandung parameter tracking rahasia.')
    if 'Location' in types_found or 'Oversharing Keyword' in types_found:
        recs.add('Hindari membagikan status lokasi real-time atau jadwal rumah kosong.')

    if not recs:
        recs.add('Postingan tampak aman secara sistem, tetap bijak bersosial media.')

    return sorted(list(recs))

def redact_text(text: str, findings: List[Dict], replacement: str = '[REDACTED]') -> str:
    """Ganti data sensitif secara aman menggunakan reverse traversal."""
    redacted = text
    # Reverse sort berdasarkan indeks 'start' untuk menghindari masalah offset
    for f in sorted(findings, key=lambda x: x['start'], reverse=True):
        start, end = f['start'], f['end']
        redacted = redacted[:start] + replacement + redacted[end:]
    return redacted

def rewrite_text(text: str) -> str:
    """Mengganti data sensitif dengan placeholder yang lebih kontekstual."""
    findings = analyze_text(text)['findings']
    safe = text

    # Memproses dari belakang agar index potongan string di depannya tidak bergeser
    for f in reversed(findings):
        start, end = f['start'], f['end']
        ftype = f['type']
        
        if ftype == 'Phone Number':
            replacement = '[nomor pribadi]'
        elif ftype == 'Email':
            replacement = '[email]'
        elif ftype == 'NIK':
            replacement = '[identitas]'
        elif ftype == 'Credit Card':
            replacement = '[kartu kredit]'
        elif ftype == 'URL':
            replacement = '[tautan]'
        elif ftype == 'IP Address':
            replacement = '[alamat IP]'
        elif ftype == 'Oversharing Keyword':
            replacement = get_safe_phrase(f['value'].lower())
        else:
            replacement = '[disensor]'
            
        safe = safe[:start] + replacement + safe[end:]

    return re.sub(r'\s+', ' ', safe).strip()

def get_safe_phrase(keyword: str) -> str:
    mapping = {
        'rumah kosong': 'rumah dalam keadaan aman',
        'sendirian di rumah': 'beristirahat di rumah',
        'pergi ke luar kota': 'sedang ada kegiatan',
        'password saya': 'kata sandi',
        'nomor rekening': 'detail pembayaran',
        'ibu kandung': 'keluarga',
        'tanggal lahir': 'detail pribadi',
        'sedang di': 'sedang di suatu tempat',
        'tiket pesawat': 'tiket perjalanan',
        'boarding pass': 'dokumen penerbangan',
        'kunci rumah': 'kunci',
        'safe word': 'kode keamanan',
        'pin atm': 'PIN',
        'kode otp': 'kode verifikasi',
    }
    return mapping.get(keyword, keyword)