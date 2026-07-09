from flask import Flask, render_template, request, jsonify
from analyzer import analyze_text, rewrite_text

app = Flask(__name__)
app.secret_key = 'sharewise_secret_key_2026'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/education')
def education():
    return render_template('education.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/analyze', methods=['GET', 'POST'])
def analyze():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Text is empty'}), 400

        result = analyze_text(text)
        return jsonify(result)

    return render_template('analyze.html')

@app.route('/rewrite', methods=['POST'])
def rewrite():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    text = data['text'].strip()
    if not text:
        return jsonify({'error': 'Text is empty'}), 400

    safe_version = rewrite_text(text)
    return jsonify({'safe_text': safe_version})

# API untuk kuis (jika diperlukan di halaman kuis)
@app.route('/api/quiz')
def api_quiz():
    quiz_data = [
        {
            "question": "Apa yang dimaksud dengan oversharing?",
            "options": [
                "Membagikan terlalu banyak informasi pribadi di internet",
                "Mengunggah foto liburan",
                "Berbagi tautan artikel",
                "Menyukai postingan teman"
            ],
            "answer_index": 0,
            "category": "Definisi"
        },
        {
            "question": "Informasi mana yang paling berbahaya jika dibagikan secara publik?",
            "options": [
                "Nama panggilan",
                "Nomor telepon dan alamat rumah",
                "Genre musik favorit",
                "Merek ponsel"
            ],
            "answer_index": 1,
            "category": "Data Pribadi"
        },
        {
            "question": "Apa langkah pertama sebelum membagikan postingan di media sosial?",
            "options": [
                "Langsung posting",
                "Periksa apakah ada data sensitif",
                "Minta like teman",
                "Tambahkan lokasi"
            ],
            "answer_index": 1,
            "category": "Kebiasaan"
        },
        {
            "question": "Apa itu phishing?",
            "options": [
                "Jenis ikan",
                "Serangan siber untuk mencuri data dengan menyamar",
                "Aplikasi edit foto",
                "Jaringan Wi-Fi gratis"
            ],
            "answer_index": 1,
            "category": "Ancaman"
        },
        {
            "question": "Mengapa membagikan tiket pesawat bisa berbahaya?",
            "options": [
                "Karena harganya mahal",
                "Karena barcode bisa dipindai dan mengungkap data pribadi",
                "Karena teman jadi iri",
                "Tidak berbahaya sama sekali"
            ],
            "answer_index": 1,
            "category": "Oversharing"
        },
        {
            "question": "Cara terbaik melindungi akun media sosial adalah?",
            "options": [
                "Menggunakan password yang sama untuk semua akun",
                "Aktifkan two-factor authentication (2FA)",
                "Membagikan password ke teman",
                "Mematikan notifikasi"
            ],
            "answer_index": 1,
            "category": "Proteksi"
        }
    ]
    return jsonify(quiz_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)