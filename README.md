# 🎙️ DevInterview - AI HRD Platform

Platform simulasi wawancara kerja interaktif berbasis **Kecerdasan Buatan (Artificial Intelligence)** dengan avatar 3D interaktif, analisis ekspresi wajah secara *real-time*, pengenalan suara (*Speech-to-Text & Text-to-Speech*), evaluasi adaptif, dan laporan hasil interview yang dapat diunduh dalam format PDF.

---

## 📌 Daftar Isi
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori](#-struktur-direktori)
- [Prasyarat Sistem](#-prasyarat-sistem)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Alur Penggunaan Aplikasi](#-alur-penggunaan-aplikasi)
- [Konfigurasi Lingkungan (Environment Variables)](#-konfigurasi-lingkungan-environment-variables)

---

## 💡 Tentang Proyek

**DevInterview** dirancang untuk membantu para pencari kerja, lulusan baru (*fresh graduates*), dan profesional mengasah keterampilan wawancara mereka. Platform ini mensimulasikan sesi interview kerja realistis bersama pewawancara AI (avatar 3D Elon Musk). 

Sistem ini mengajukan 7 pertanyaan berbobot yang disesuaikan secara dinamis berdasarkan posisi dan tingkat pengalaman kandidat, menyimak jawaban kandidat melalui audio/mikrofon, memantau ekspresi wajah kandidat via webcam, dan memberikan evaluasi mendalam serta rekomendasi perbaikan berbasis metode STAR.

---

## ✨ Fitur Utama

### 1. 🤖 Avatar Pewawancara 3D Interaktif
- Rendering 3D *real-time* avatar HRD menggunakan **Three.js** dan **React Three Fiber**.
- Status animasi reaktif: *Idle*, *Listening* (mendengarkan kandidat), *Thinking* (memproses AI), dan *Speaking* (berbicara).
- Pencahayaan dinamis dan tata panggung visual yang futuristik.

### 2. 🗣️ Voice AI (Speech-to-Text & Text-to-Speech)
- **Text-to-Speech (TTS)**: Pewawancara AI menyuarakan setiap pertanyaan dalam Bahasa Indonesia secara alami, dilengkapi Chromium keep-alive resume untuk mencegah suara terputus.
- **Speech-to-Text (STT)**: Transkripsi suara kandidat secara *real-time* via Web Speech Recognition API dengan opsi fallback pengetikan manual.

### 3. 👁️ Analisis Ekspresi Wajah & Kontak Mata
- Deteksi *landmark* wajah dan emosi kandidat secara langsung menggunakan model **face-api.js** via webcam.
- Umpan balik tingkat kepercayaan diri, senyuman, dan konsistensi tatapan selama sesi berlangsung.

### 4. 🎯 Wawancara Adaptif 7 Pertanyaan
- Alur wawancara terstruktur terdiri dari **7 pertanyaan relevan** (pembuka, teknis, *situational*, *behavioral*, penyelesaian masalah, hingga penutup).
- Pertanyaan disesuaikan secara cerdas dengan posisi target (misal: *Frontend Developer*, *Data Analyst*, *UI/UX Designer*) dan tingkat pengalaman kandidat.

### 5. 📊 Evaluasi & Rekomendasi Terperinci
- Penilaian skor komprehensif (0–100) serta status kelayakan (*Direkomendasikan*, *Perlu Latihan*, dll).
- Ulasan kekuatan (*Key Strengths*), area peningkatan (*Areas for Improvement*), dan saran jawaban taktis dengan metode **STAR** (*Situation, Task, Action, Result*).

### 6. 📄 Ekspor Laporan Evaluasi ke PDF
- Mengunduh rekap evaluasi lengkap dalam bentuk dokumen PDF formal menggunakan **jsPDF** & **html2canvas**.

### 7. 📈 Dashboard & Riwayat Interview
- Statistik performa akumulatif: Total Sesi, Rata-rata Skor, Total Menit Latihan, dan Tren Perkembangan Skor.
- Riwayat sesi tersimpan di browser (*LocalStorage*) dengan status *empty state* yang informatif.

### 8. 🌓 Tampilan Modern Glassmorphism (Dark & Light Mode)
- Desain antarmuka responsif dengan transisi tema Gelap dan Terang (*Dark/Light Mode*).

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi / Pustaka | Deskripsi & Kegunaan |
| :--- | :--- | :--- |
| **Frontend Core** | [React 19](https://react.dev/) | Library UI berbasis komponen reaktif terbaru |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) | Tooling frontend modern dengan HMR (*Hot Module Replacement*) super cepat |
| **3D Graphics & Engine** | [Three.js](https://threejs.org/) | Rendering grafis 3D WebGL di browser |
| | [@react-three/fiber](https://r3f.docs.pmnd.rs/) | React renderer deklaratif untuk Three.js |
| | [@react-three/drei](https://github.com/pmndrs/drei) | Pustaka helper dan utilitas komponen 3D |
| **Computer Vision AI** | [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/) | Deteksi wajah, landmark, dan klasifikasi ekspresi |
| **AI Interview Engine** | [Google Gemini API](https://ai.google.dev/) / LLM | Penalaran dan generasi pertanyaan adaptif |
| **Speech APIs** | Web Speech API | `SpeechSynthesis` (TTS) & `SpeechRecognition` (STT) |
| **Dokumen & Ekspor** | [jsPDF](https://github.com/parallax/jsPDF) | Pembuatan file PDF di sisi klien |
| | [html2canvas](https://html2canvas.hertzen.com/) | Render visual HTML ke canvas untuk ekspor dokumen |
| **Ikon Antarmuka** | [Lucide React](https://lucide.dev/) | Paket ikon SVG modern dan konsisten |
| **Linter & Code Quality** | [Oxlint](https://oxc.rs/) | Linter JavaScript/React performa tinggi berbasis Rust |
| **Styling** | Modern CSS | CSS Variables, Glassmorphism, Theme Switching |

---

## 📂 Struktur Direktori

```text
ai-interview/
├── public/                     # Aset statis & model neural network face-api.js
│   ├── models/                 # Model bobot face-api (ssdMobilenetv1, faceExpressionNet, dll)
│   └── ...
├── src/
│   ├── assets/                 # Gambar avatar, ilustrasi, dan aset visual
│   ├── components/             # Komponen antarmuka pengguna
│   │   ├── AIHRD3D.jsx         # Komponen avatar 3D pewawancara
│   │   ├── AmbientBackground.jsx # Latar belakang partikel dinamis
│   │   ├── Dashboard.jsx       # Tampilan beranda & orkestrator navigasi
│   │   ├── DashboardHeader.jsx # Header dashboard & toggle tema
│   │   ├── FormInput.jsx       # Formulir registrasi sesi & posisi interview
│   │   ├── InterviewHistory.jsx# Tabel riwayat & empty state
│   │   ├── InterviewSession.jsx# Halaman sesi wawancara aktif (Kamera + Avatar + Chat)
│   │   ├── InterviewTips.jsx   # Kumpulan artikel tips wawancara kerja
│   │   ├── ResultPage.jsx      # Halaman hasil evaluasi & ekspor PDF
│   │   ├── Sidebar.jsx         # Menu navigasi samping
│   │   ├── StatCard.jsx        # Kartu ringkasan statistik metrik
│   │   └── UserProfileView.jsx # Tampilan manajemen profil pengguna
│   ├── lib/
│   │   ├── ai.js               # Integrasi LLM, prompt system, & logika wawancara
│   │   └── storage.js          # Utilitas LocalStorage untuk riwayat & statistik
│   ├── constants.js            # Konstanta global (jumlah pertanyaan, threshold)
│   ├── App.jsx                 # Komponen akar & router state
│   └── main.jsx                # Titik masuk utama aplikasi React
├── package.json                # Dependensi & skrip proyek
├── vite.config.js              # Konfigurasi bundler Vite
└── README.md                   # Dokumentasi proyek
```

---

## 💻 Prasyarat Sistem

Sebelum menjalankan aplikasi, pastikan komputer Anda telah terinstal:
- **Node.js**: Versi `18.x` atau lebih baru (direkomendasikan versi LTS)
- **NPM** atau **PNPM / Yarn**
- **Browser Modern**: Google Chrome atau Microsoft Edge (direkomendasikan untuk dukungan penuh *Web Speech API* & *WebGL*).
- **Perangkat Keras**: Mikrofon dan Webcam aktif (untuk simulasi video dan suara).

---

## 🚀 Panduan Instalasi & Menjalankan

1. **Clone atau Buka Direktori Proyek**:
   ```bash
   cd ai-interview
   ```

2. **Pasang Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembangan (Dev Server)**:
   ```bash
   npm run dev
   ```

4. **Buka Aplikasi di Browser**:
   Buka peramban dan navigasikan ke alamat lokal:
   ```text
   http://localhost:5173
   ```

5. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

6. **Cek Kerapian Kode (Linter)**:
   ```bash
   npm run lint
   ```

---

## 🔄 Alur Penggunaan Aplikasi

1. **Dashboard Utama**: Menampilkan ringkasan statistik interview, riwayat terbaru, dan shortcut mulai interview.
2. **Setup Wawancara**: Mengisi nama kandidat, posisi yang dilamar (misal: *Backend Developer*), dan tingkat pengalaman.
3. **Izin Perangkat**: Izinkan akses kamera dan mikrofon saat diminta oleh peramban.
4. **Sesi Interview**:
   - HRD AI menyapa dan membacakan pertanyaan pertama.
   - Kandidat menjawab via suara menggunakan tombol mikrofon atau melalui teks chat.
   - Analisis wajah memantau ekspresi dan tatapan secara berkelanjutan.
   - Interview berlangsung selama **7 pertanyaan** terarah.
5. **Evaluasi & Unduh PDF**: Selesai sesi, tinjau skor, detail analisis kekuatan, kelemahan, serta unduh sertifikat/laporan evaluasi PDF.
6. **Riwayat**: Hasil otomatis tersimpan di riwayat dan dapat diakses kembali kapan saja.

---

## ⚙️ Konfigurasi Lingkungan (Environment Variables)

Aplikasi telah dilengkapi fallback cerdas sehingga dapat berjalan langsung dalam mode simulasi interaktif. Jika Anda ingin menghubungkan API Key Gemini eksternal secara langsung:

Buat file `.env` di direktori utama:
```env
VITE_GEMINI_API_KEY=kunci_api_gemini_anda_disini
```

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan simulasi interview kerja inovatif dan partisipasi kompetisi teknologi informasi.
Semua hak cipta dan merek dagang adalah milik masing-masing pengembang.
