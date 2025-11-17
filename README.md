# Platform Pembelajaran Tabel Periodik

Aplikasi web interaktif untuk mempelajari tabel periodik unsur dengan bimbingan berbasis AI, rencana pembelajaran yang dipersonalisasi, dan kuis penilaian.

## Fitur

- **Tabel Periodik Interaktif**: Klik pada elemen apa pun untuk mempelajarinya
- **Chat Tutor AI**: Ajukan pertanyaan kepada Profesor Elemento, tutor kimia AI Anda
- **Pembelajaran yang Dipersonalisasi**: Dapatkan rencana pembelajaran yang disesuaikan berdasarkan hasil pra-tes Anda
- **Kuis Penilaian**: Ikuti kuis pra-tes dan pasca-tes untuk melacak kemajuan Anda
- **Detail Elemen**: Lihat informasi detail tentang setiap elemen

## Cara Menggunakan

### Memulai

1. **Instal Dependensi**
   ```bash
   npm install
   ```

2. **Siapkan API Key**
   - Buat file `.env.local` di direktori root
   - Tambahkan kunci API Gemini Anda:
     ```
     GEMINI_API_KEY=kunci_api_anda_di_sini
     ```

3. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```

4. **Buka di Browser**
   - Aplikasi biasanya berjalan di `http://localhost:5173`
   - Periksa terminal untuk URL yang tepat

### Menggunakan Aplikasi

#### Langkah 1: Kuis Pra-Tes
- Saat pertama kali membuka aplikasi, Anda akan disajikan dengan **Kuis Pra-Tes**
- Jawab 5 pertanyaan tentang tabel periodik untuk menilai pengetahuan Anda saat ini
- Klik "Submit" ketika selesai
- Skor Anda akan digunakan untuk membuat rencana pembelajaran yang dipersonalisasi

#### Langkah 2: Fase Pembelajaran
Setelah menyelesaikan pra-tes, Anda akan memasuki **Fase Pembelajaran**:

**Tabel Periodik Interaktif**
- Tabel periodik ditampilkan dengan kategori elemen yang diberi kode warna
- **Klik pada elemen apa pun** untuk mempelajarinya
- Elemen yang dipilih akan disorot dengan border cyan
- Elemen diberi kode warna berdasarkan kategori (logam, nonlogam, gas mulia, dll.)

**Panel Detail Elemen**
- Saat Anda mengklik elemen, informasi detail muncul di panel kiri
- Tutor AI akan secara otomatis menjelaskan properti dan kegunaan elemen

**Chat Tutor AI (Profesor Elemento)**
- Gunakan jendela chat di sisi kanan untuk mengajukan pertanyaan
- Tutor AI dapat:
  - Menjelaskan properti elemen
  - Menjawab pertanyaan kimia
  - Membantu Anda memahami konsep
  - Memberikan informasi tambahan tentang elemen
- Ketik pertanyaan Anda dan tekan Enter atau klik Kirim

**Rencana Pembelajaran**
- Setelah pra-tes, rencana pembelajaran yang dipersonalisasi akan ditampilkan
- Tinjau rencana untuk melihat topik apa yang harus Anda fokuskan
- Klik "Start Learning" untuk mulai menjelajahi tabel periodik

**Mengambil Pasca-Tes**
- Ketika Anda siap, klik tombol **"Ambil Pasca-Tes"**
- Ini akan memulai kuis pasca-tes dengan 5 pertanyaan baru

#### Langkah 3: Kuis Pasca-Tes
- Jawab 5 pertanyaan untuk melihat seberapa banyak yang telah Anda pelajari
- Klik "Submit" ketika selesai

#### Langkah 4: Lihat Hasil
- Setelah pasca-tes, Anda akan melihat **Halaman Hasil**
- Bandingkan skor pra-tes dan pasca-tes Anda
- Lihat persentase peningkatan Anda
- Klik **"Ulangi"** untuk memulai ulang dengan kuis baru

### Tips untuk Pengalaman Terbaik

1. **Jelajahi Elemen**: Klik pada berbagai elemen untuk mempelajari properti dan kegunaannya
2. **Ajukan Pertanyaan**: Jangan ragu untuk bertanya kepada Profesor Elemento tentang pertanyaan terkait kimia
3. **Tinjau Rencana Pembelajaran Anda**: Fokus pada topik yang disarankan dalam rencana pembelajaran yang dipersonalisasi
4. **Luangkan Waktu**: Tidak ada batas waktu, jadi luangkan waktu Anda untuk memahami setiap konsep
5. **Coba Elemen Berbeda**: Jelajahi elemen dari berbagai kategori untuk mendapatkan pemahaman yang menyeluruh

### Pintasan Keyboard

- **Enter**: Kirim pesan di chat (ketika input difokuskan)
- **Klik**: Pilih elemen dari tabel periodik

## Persyaratan Teknis

- **Node.js** (versi 14 atau lebih tinggi direkomendasikan)
- **npm** atau **yarn** sebagai package manager
- **Kunci API Gemini** dari Google AI Studio

## Struktur Proyek

```
├── components/          # Komponen React
│   ├── ChatWindow.tsx   # Antarmuka chat tutor AI
│   ├── ElementDetail.tsx # Tampilan informasi elemen
│   ├── LearningPlan.tsx  # Rencana pembelajaran yang dipersonalisasi
│   ├── PeriodicTable.tsx  # Tabel periodik interaktif
│   ├── Quiz.tsx          # Komponen kuis
│   └── Results.tsx       # Tampilan hasil
├── services/            # Layanan API
│   └── geminiService.ts # Integrasi Gemini AI
├── App.tsx              # Komponen aplikasi utama
└── types.ts             # Definisi tipe TypeScript
```

## Pemecahan Masalah

**Chat tidak berfungsi?**
- Periksa bahwa `GEMINI_API_KEY` Anda sudah diatur dengan benar di `.env.local`
- Pastikan kunci API valid dan memiliki izin yang tepat
- Segarkan halaman jika koneksi gagal

**Elemen tidak bisa diklik?**
- Pastikan Anda berada di Fase Pembelajaran (setelah menyelesaikan pra-tes)
- Coba segarkan halaman

**Kuis tidak dimuat?**
- Periksa koneksi internet Anda
- Verifikasi kunci API Anda berfungsi
- Periksa konsol browser untuk pesan kesalahan

## Dukungan

Untuk masalah atau pertanyaan, silakan periksa:
- Konfigurasi kunci API Anda
- Konsol browser untuk pesan kesalahan
- Konektivitas jaringan
️
