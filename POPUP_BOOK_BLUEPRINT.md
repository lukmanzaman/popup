# Panduan & Blueprint Pembuatan Web Pop-Up Book 3D Interaktif (HTML + CSS 3D + SVG)

Dokumen ini adalah panduan arsitektur sekaligus **template prompt siap pakai** agar Anda dapat membuat kembali buku pop-up 3D web interaktif bergaya *paper-craft* (seperti proyek **The Folded Atlas** di folder ini) untuk **cerita, mata pelajaran, cerita rakyat, sejarah, sains, atau topik apa pun** — **cukup dengan instruksi teks saja, tanpa perlu video rujukan**.

---

## 1. Gambaran Konsep & Teknologi

Proyek ini dibangun dengan prinsip **Zero-Build & Zero-Dependency**:
- **HTML5 + CSS 3D (`perspective`, `transform-style: preserve-3d`)**: membentuk buku fisik 3D di atas meja, halaman yang dapat dibolak-balik secara mulus (*real-time*), serta engsel kertas pop-up yang otomatis melipat datar saat halaman ditutup dan berdiri tegak saat halaman dibuka.
- **Inline SVG bergaya *Paper-Cut* (*Die-Cut Cardstock*)**: seluruh peta halaman, bangunan, karakter berartikulasi, dan properti dibuat dengan SVG vektor sehingga tetap tajam di segala ukuran layar.
- **Vanilla JavaScript + Web Audio API**: mengendalikan fisika pembalik halaman kontinu, orbit kamera meja 3D, animasi karakter berjalan & lingkungan hidup, puzzle interaktif di tiap bab, serta efek suara sintetis (tanpa perlu file audio `.mp3`).
- **Langsung berjalan via `file://`**: cukup klik ganda `index.html` di browser tanpa server atau bundler.

### Struktur 4 File Modular
| File | Tanggung Jawab |
| :--- | :--- |
| `index.html` | Kerangka panggung buku 3D, 4 slot halaman, HUD atas/bawah, modal **Map**, dan modal **Read this page**. |
| `styles.css` | Estetika meja baca, geometri buku 3D, engsel `.standee`, animasi artikulasi karakter & lingkungan, dan responsivitas. |
| `svg-art.js` | Pustaka aset SVG (peta halaman kiri/kanan, karakter, bangunan pop-up, peta keseluruhan) serta array konfigurasi `ATLAS_CHAPTERS`. |
| `app.js` | Engine pembalik halaman 3D kontinu, orbit kamera meja, loop animasi karakter berjalan (*living world*), logika puzzle tiap bab, dan synthesizer audio. |

---

## 2. Anatomi Visual & Estetika *Paper-Craft*

Agar hasil selalu terlihat seperti buku pop-up fisik buatan tangan (bukan halaman web biasa), pertahankan 6 elemen visual kunci berikut:

1. **Latar Meja Baca (*Desk Backdrop*)**:
   - Gradien radial gelap lembut (mis. hijau hutan tua `#14221c → #294638`) dengan tekstur bintik halus (*grain*).
   - Mendukung pergantian suasana latar per chapter (mis. siang hangat → senja/malam biru tua `#0c151c → #1f3340`).
2. **Buku Fisik 3D di Atas Meja**:
   - Ukuran standar spread terbuka: `940px × 590px` (halaman kiri `470px`, halaman kanan `470px`), diskalakan otomatis mengikuti ukuran viewport (`--book-scale`).
   - Sudut pandang default: `perspective: 1850px`, `rotateX(54deg) rotateZ(-3deg)`.
   - Detail fisik: bayangan lembut di meja (`translateZ(-26px)`), sampul *hardcover* kulit (`translateZ(-16px)`), tumpukan kertas berlapis (`repeating-linear-gradient`), lipatan tengah (*spine crease*), dan bayangan cekungan tengah (*gutter shadow*).
3. **Permukaan Peta Halaman**:
   - Kertas krem hangat (`#efe6cf`), bingkai garis tipis ganda, ilustrasi peta datar (sungai, jalan, padang, pantai), jalur garis putus-putus yang bergerak pelan (`stroke-dashoffset`), label lokasi di pojok kiri bawah (`NAMA LOKASI`), dan nomor pelat di kanan bawah (`PLATE 01`–`05`).
4. **Efek Potongan Kertas (*Die-Cut Cardstock*) pada SVG**:
   - Beri *outline* luar berwarna krem kertas (`stroke="#f7efd9"`, `stroke-width="4"` s.d. `"6"`, `stroke-linejoin="round"`) pada karakter, rambu, dan objek menonjol agar terlihat seperti dipotong dari kertas karton tebal.
   - Beri `filter: drop-shadow(...)` tipis pada SVG dan **bayangan kontak elips** (`.standee-shadow`) tepat di alas bawah setiap pop-up.
   - Objek langit (matahari, bulan, awan) ditopang oleh **batang kertas krem tipis transparan** ke bawah agar autentik seperti mekanisme buku pop-up asli.
5. **Palet Warna Matte Hangat**:
   - Hindari warna neon menyala. Gunakan warna buku cerita klasik: krem kertas (`#efe6cf`), merah terakota (`#b84a39`), emas kuningan (`#e8b44c`), hijau pinus (`#2e5943` / `#568c64`), teal air (`#5c999c`), cokelat kayu (`#7a5337`).
6. **Tipografi Editorial**:
   - Judul & narasi: Serif elegan (`Fraunces` / `Playfair Display` / `Georgia`).
   - Label chapter, kode pelat, indikator status: Monospace huruf kapital berjarak (`JetBrains Mono`).
   - Tombol & petunjuk singkat: Sans-serif bersih (`Plus Jakarta Sans`).

---

## 3. Matematika & Mekanika 3D Pop-Up

### A. Engsel Berdiri Standee (`rotateX` negatif)
Dalam koordinat CSS 3D (`+X` kanan, `+Y` bawah, `+Z` keluar menuju mata pembaca):
- Posisikan tiap elemen pop-up (`.standee`) di titik alas `(x, y)` dengan `transform-origin: 50% 100%`.
- Transformasi:
  ```css
  transform:
    translate3d(-50%, -100%, 1px)
    rotateZ(var(--yaw, 0deg))
    rotateX(var(--fold-angle, -86deg));
  ```
- `--fold-angle: 0deg` → kertas rebah rata menempel di halaman.
- `--fold-angle: -86deg` s.d. `-88deg` → kertas berdiri tegak ke atas (`+Z`).

### B. Engine Pembalik Halaman Kontinu (`bookPos` dari `0.0` ke `N - 1`)
Gunakan satu variabel kontinu `bookPos` (misalnya `0.0` sampai `4.0` untuk 5 bab):
- `curr = Math.floor(bookPos)`, `next = curr + 1`, `t = bookPos - curr` (`0..1`).
- **Saat diam (`t ≈ 0` atau `t ≈ 1`)**: `turningLeaf` disembunyikan; `staticLeft` dan `staticRight` menampilkan bab aktif dengan seluruh pop-up berdiri penuh (`factor = 1`) dan interaktif.
- **Saat sedang dibalik (`0 < t < 1`)**:
  - `staticLeft` = Halaman Kiri bab keluar (`curr`)
  - `turningLeaf` (`transform-origin: left center`, `rotateY(-t * 180deg)`):
    - `leafFront` (`0deg`) = Halaman Kanan bab keluar (`curr`)
    - `leafBack` (`rotateY(180deg)`) = Halaman Kiri bab masuk (`next`)
  - `staticRight` = Halaman Kanan bab masuk (`next`) yang tersingkap di bawahnya.
- **Rumus Pelipatan Pop-Up Real-Time**:
  - Pop-up bab keluar melipat rata sebelum halaman tegak lurus:
    - Kiri keluar: `Math.max(0, 1 - t / 0.56)`
    - Kanan keluar: `Math.max(0, 1 - t / 0.48)`
  - Pop-up bab masuk bangkit mulus saat halaman terbuka:
    - Kanan masuk: `Math.max(0, (t - 0.18) / 0.82)`
    - Kiri masuk: `Math.max(0, (t - 0.52) / 0.48)`
- **Aturan Penting ID SVG**: Setiap `<clipPath>`, `<linearGradient>`, atau `<radialGradient>` di dalam SVG harus memakai generator ID unik (`uid()`) agar tidak bentrok ketika halaman statis dan halaman lipat sama-sama terpasang di DOM.

---

## 4. Sistem Animasi Hidup (*Living Storybook*)

Agar buku terasa benar-benar hidup (bukan sekadar gambar diam):

1. **Karakter Utama Berjalan dengan Artikulasi SVG**:
   - Pisahkan struktur SVG karakter utama ke dalam grup: `.flip-wrap` (untuk balik arah `scaleX(-1)`), `.tail` (ekor/jubah bergoyang), `.leg-l` & `.leg-r` (kaki melangkah bergantian `rotate(±28deg)`), `.torso` (pantulan ritmis tiap langkah), `.head` (anggukan lembut), dan `.char-eyes` (kedipan berkala).
   - Pada loop `requestAnimationFrame`, gerakkan posisi `(x, y)` karakter utama di sepanjang `walkSpec` tiap bab, sinkronkan `.standee-shadow`, berikan jeda berhenti sesekali (berhenti → lihat sekitar → jalan lagi), dan picu **tujuan khusus (*burst goal*)** saat puzzle terselesaikan (mis. berlari mendekati gerbang atau berjalan menyeberangi jembatan yang baru diperbaiki).
2. **Karakter Pendamping Hidup & Bisa Diklik**:
   - Beri gerakan khas tiap karakter (melambai, melompat berkala, mengepakkan sayap, berlari kecil, bergoyang) + reaksi klik (melompat & bersuara *chirp*).
3. **Animasi Lingkungan per Bab**:
   - Awan melayang, sinar matahari berputar lambat, bendera & *bunting* berkibar, bintang berkelip, daun gugur, benda hanyut di sungai, baling-baling berputar tertiup angin, burung mengepak terbang melingkar, perahu berlayar, serta garis rute peta yang mengalir.

---

## 5. Resep 5 Pola Interaksi Pop-Up (*Reusable Mechanics*)

Saat merancang cerita baru, Anda dapat memetakan tiap bab ke variasi mekanik taktil berikut:

| Pola Interaksi | Cara Kerja | Contoh Adaptasi Tema Lain |
| :--- | :--- | :--- |
| **1. Tap & Fisika / Cahaya** | Ketuk objek → berayun/bergetar + efek riak cahaya + suara resonan. | Membunyikan gong candi, menyalakan obor gua, mengetuk bel stasiun. |
| **2. Drag Linear Menyambung** | Tarik elemen dari titik A ke titik B → objek penghubung muncul berurutan. | Menarik jembatan tali, menyambung kabel sirkuit, mengalirkan saluran irigasi. |
| **3. Lipatan 2-Tahap & Link** | Ketuk segel/penutup → kartu catatan keluar → klik tombol tautan `[[Tujuan]]`. | Membuka gulungan lontar, membuka kapsul waktu, membuka catatan laboratorium. |
| **4. Drag Rotasi Melingkar** | Putar objek melingkar (atau klik) sampai 360° → memicu hasil keluar/tercetak. | Memutar kincir air, memutar roda kemudi kapal, memutar teleskop/planetarium. |
| **5. Tuas & Sekuens Sinyal** | Tarik tuas/sakelar → memicu rangkaian cahaya/animasi berurutan + balasan & *run counter*. | Menyalakan roket peluncur, menyalakan mercusuar, mengaktifkan mesin hujan. |

---

## 6. Tata Letak HUD & Kontrol Standar

- **Kiri Atas**: Ikon buku kecil + Judul Seri & Subjudul (`A POP-UP WEB STORY`).
- **Kanan Atas**: Tombol `Sound` (on/off), `Reset view` (kembalikan sudut 3D), ikon `Auto-rotate` meja, dan tombol `Map` (modal peta seluruh dunia cerita dengan pin lompat bab & centang progres).
- **Kiri Atas (di bawah brand)**: `CHAPTER 01 / 05 · TAG`, Judul Bab besar, Sub-lokasi miring, dan 1 baris instruksi interaksi.
- **Kiri Bawah**: Kartu narasi 1–2 kalimat yang **berubah otomatis saat puzzle selesai**, tombol `Read this page` (modal bacaan lengkap 3 paragraf), dan titik indikator progres 5 bab.
- **Kanan Bawah**: Panel `PAGE TURN` berisi tombol `←`, *scrubber slider* real-time `0..400`, tombol `→`, dan indikator persentase/nomor bab. Mendukung juga **drag langsung sudut kiri/kanan halaman** serta tombol panah keyboard + URL hash (`#bab1`..`#bab5`).

---

## 7. MASTER PROMPT SIAP PAKAI (Cukup Teks, Tanpa Video)

Salin blok prompt di bawah ini, ganti bagian di dalam tanda kurung siku `[...]`, lalu kirimkan ke AI kapan pun Anda ingin membuat buku pop-up 3D baru untuk cerita atau topik apa pun:

````markdown
Buatkan aplikasi web **3D Pop-Up Storybook Interaktif** menggunakan **HTML, CSS 3D (`perspective` & `preserve-3d`), Inline SVG bergaya *paper-cut*, dan Vanilla JavaScript** (tanpa framework/WebGL/build step, langsung jalan saat `index.html` dibuka via `file://`).

### 1. Identitas Cerita & Tema
- **Judul Buku**: [Tulis judul buku, misal: "Ekspedisi Awan Nusantara"]
- **Subjudul**: [misal: "A POP-UP WEB STORY"]
- **Tema Visual & Palet Warna**: [misal: "Nuansa kertas karton matte hangat di atas meja kayu/hijau tua; warna krem kertas, terakota, emas, hijau zamrud, dan biru laut; bab terakhir bertransisi ke suasana malam/senja"]
- **Tokoh Utama (muncul di semua bab)**: [misal: "Nara, burung rangkong kecil bersyal merah dan tas peta — harus punya animasi berjalan berartikulasi (kaki melangkah bergantian, badan memantul, kepala mengangguk, mata berkedip, ekor/sayap bergerak, balik arah hadap kiri/kanan)"]
- **Bahasa Antarmuka & Cerita**: [Indonesia / Inggris]

### 2. Spesifikasi Teknis Wajib (Engine Buku Pop-Up 3D)
- **Struktur 4 file modular**: `index.html`, `styles.css`, `svg-art.js`, `app.js`.
- **Buku 3D Fisik di Atas Meja**:
  - Spread terbuka `940x590px` (kiri `470px`, kanan `470px`), responsif dengan `--book-scale`, sudut pandang default `rotateX(54deg) rotateZ(-3deg)`.
  - Memiliki sampul hardcover 3D, tumpukan ketebalan halaman kiri/kanan, bayangan meja, lipatan tulang tengah (*spine crease*), dan *gutter shadow*.
  - Meja dapat diputar bebas (*drag* orbit + *wheel* zoom), disertai tombol `Reset view` dan toggle `Auto-rotate` lembut.
- **Pembalik Halaman 3D Kontinu (Real-Time)**:
  - Menggunakan 4 slot halaman (`staticLeft`, `staticRight`, `turningLeaf` dengan `leafFront` + `leafBack`).
  - Saat halaman dibalik (melalui slider `PAGE TURN`, tombol `←`/`→`, keyboard panah, atau **drag sudut kiri/kanan halaman**), semua pop-up pada bab keluar **melipat datar mulus (`rotateX(0deg)`)** dan semua pop-up pada bab masuk **tegak otomatis (`rotateX(-86deg)`)**.
  - Semua `<clipPath>` / `<linearGradient>` / `<radialGradient>` SVG wajib memakai ID unik agar tidak bentrok antar slot halaman.
- **Gaya Ilustrasi SVG *Paper-Cut***:
  - Setiap karakter, bangunan, dan properti punya garis tepi krem karton (*die-cut halo*), bayangan kontak di lantai kertas (`.standee-shadow`), dan elemen langit ditopang batang kertas tipis.
  - Peta datar di halaman memuat bingkai tipis, nama lokasi di kiri bawah, `PLATE 01`–`05` di kanan bawah, serta jalur garis putus-putus yang mengalir pelan.
- **Animasi Hidup (*Living World*)**:
  - Tokoh utama berjalan patroli otomatis sepanjang jalur di tiap bab (bayangan ikut bergerak), berhenti sejenak lalu berjalan lagi, dan bergerak mendekat/bereaksi ketika puzzle bab selesai.
  - Tiap bab punya karakter pendamping dengan animasi idle khas (melambai/melompat/mengepak/bergoyang) yang bisa diklik untuk melompat & bersuara.
  - Tiap bab punya animasi lingkungan aktif (mis. awan melayang, bendera berkibar, benda hanyut di sungai, daun jatuh, kincir/baling-baling berputar tertiup angin, burung terbang melingkar, atau perahu berlayar).
- **HUD & Audio**:
  - Top HUD: logo buku, tombol `Sound` (Web Audio API sintetis tanpa file audio), `Reset view`, toggle `Auto-rotate`, tombol `Map` (modal peta SVG interaktif untuk lompat bab & lihat progres).
  - Upper-left: label `CHAPTER 0X / 05 · TAG`, Judul Bab, Lokasi, dan petunjuk interaksi yang berubah setelah selesai.
  - Bottom-left: kartu narasi cerita, tombol `Read this page` (modal bacaan lengkap 3 paragraf), dan titik indikator progres.
  - Bottom-right: kontrol `PAGE TURN` + sinkronisasi URL hash per bab.

### 3. Rincian 5 Chapter (Isi Sesuai Cerita/Topik Anda)
1. **Chapter 01 (`#bab1`) — [Judul Bab 1] · Lokasi: [Lokasi 1] · Tag: [TAG]**
   - **Latar & Properti Pop-Up**: [Bangunan utama, pohon/bukit, langit, rambu]
   - **Karakter Pendamping**: [Nama/jenis & animasi khasnya]
   - **Interaksi (Tipe Tap/Fisika)**: [Apa yang diketuk & reaksi visual/ceritanya]
   - **Narasi Awal → Narasi Selesai**: [Kalimat singkat awal → kalimat setelah selesai]

2. **Chapter 02 (`#bab2`) — [Judul Bab 2] · Lokasi: [Lokasi 2] · Tag: [TAG]**
   - **Latar & Properti Pop-Up**: [Sungai/jurang, jembatan/penghubung, elemen hanyut]
   - **Karakter Pendamping**: [Nama/jenis & animasi khasnya]
   - **Interaksi (Tipe Drag Linear)**: [Apa yang ditarik dari titik A ke B & efeknya, termasuk tokoh utama berjalan menyeberang setelah tersambung]
   - **Narasi Awal → Narasi Selesai**: [...]

3. **Chapter 03 (`#bab3`) — [Judul Bab 3] · Lokasi: [Lokasi 3] · Tag: [TAG]**
   - **Latar & Properti Pop-Up**: [Perpustakaan/arsip/bangunan unik, daun/partikel melayang]
   - **Karakter Pendamping**: [Nama/jenis & animasi khasnya]
   - **Interaksi (Tipe Lipatan 2-Tahap)**: [Buka amplop/gulungan → muncul kartu catatan dengan tautan `[[Tujuan]]` yang bisa diklik]
   - **Narasi Awal → Narasi Selesai**: [...]

4. **Chapter 04 (`#bab4`) — [Judul Bab 4] · Lokasi: [Lokasi 4] · Tag: [TAG]**
   - **Latar & Properti Pop-Up**: [Kincir/mesin berputar, ladang/alat yang bergerak tertiup angin]
   - **Karakter Pendamping**: [Nama/jenis & animasi khasnya]
   - **Interaksi (Tipe Drag Rotasi 360°)**: [Putar baling-baling/roda secara melingkar atau klik → mencetak/mengeluarkan objek kunci]
   - **Narasi Awal → Narasi Selesai**: [...]

5. **Chapter 05 (`#bab5`) — [Judul Bab 5] · Lokasi: [Lokasi 5] · Tag: [TAG] (Tema: Senja/Malam)**
   - **Latar & Properti Pop-Up**: [Menara/mercusuar/puncak, bulan & bintang, burung terbang melingkar, kendaraan/kapal bergerak]
   - **Karakter Pendamping**: [Nama/jenis & animasi khasnya]
   - **Interaksi (Tipe Tuas & Sekuens Sinyal + Run History)**: [Tarik tuas/tekan pemicu → sekuens cahaya/efek beruntun + balasan dari kejauhan + bisa diulang berkali-kali dengan pencatat jumlah run]
   - **Narasi Awal → Narasi Selesai**: [...]
````

---

## 8. Contoh Ide Penerapan Cepat (Selain Cerita Rubah)

Anda tinggal mengisi bagian `[...]` pada Master Prompt di atas untuk topik apa saja, misalnya:

- **Edukasi Sains — *"Perjalanan Setetes Air"***:
  - Tokoh utama: *Tetes Air kecil bertopi daun*.
  - 5 Bab: (1) Ketuk Matahari di Samudra untuk evaporasi, (2) Tarik angin untuk menggabungkan awan, (3) Buka catatan lapisan atmosfer `[[Puncak Gunung]]`, (4) Putar kincir air di sungai pegunungan, (5) Tarik tuas bendungan untuk menyalakan lampu kota saat senja.
- **Cerita Rakyat Nusantara — *"Lentera Borobudur & Sungai Progo"***:
  - Tokoh utama: *Kancil pengantar pesan berselempang batik*.
  - 5 Bab: (1) Ketuk kentongan gerbang desa, (2) Tarik rakit bambu menyeberangi sungai, (3) Buka gulungan lontar di pendopo pustaka, (4) Putar roda gerabah/kincir sawah, (5) Nyalakan lentera puncak stupa saat malam purnama.
- **Sejarah / Biografi / Produk Interaktif**:
  - 5 Bab mewakili 5 tonggak sejarah (Awal Mula → Tantangan → Penemuan Kunci → Eksperimen/Mesin → Peluncuran Puncak), lengkap dengan peta perjalanan di tombol `Map` dan esai mendalam di tombol `Read this page`.

---

## 9. Daftar Cek Kualitas Sebelum Selesai

Setiap kali Anda membuat buku pop-up baru dengan prompt di atas, pastikan 6 hal ini terverifikasi:
1. `index.html` bisa langsung dibuka lewat browser tanpa error konsol.
2. Slider `PAGE TURN` dan *drag* sudut halaman melipat pop-up keluar menjadi rata dan menegakkan pop-up masuk secara halus.
3. Tidak ada gradien/clip-path SVG yang hilang setelah bolak-balik halaman (ID SVG unik).
4. Tokoh utama benar-benar melangkah berjalan (kaki, badan, bayangan, dan arah hadap berubah) serta bereaksi saat puzzle selesai.
5. Seluruh 5 puzzle bisa diselesaikan baik dengan *drag* maupun *tap/klik* (ramah desktop & layar sentuh).
6. Modal `Map` dan `Read this page` sinkron dengan status penyelesaian setiap bab.
