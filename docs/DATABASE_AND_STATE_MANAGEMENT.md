# DATABASE & STATE MANAGEMENT
*Panduan Aliran Data untuk Ekosistem LUMINA Overmind*

Mengingat kompleksitas dari berjalannya 25 bot AI otonom secara paralel, manajemen *state* (status data) dan operasi database menjadi titik paling kritis untuk menjaga keandalan (*reliability*) sistem.

Dokumen ini menjelaskan bagaimana arsitektur data dibagi dan di mana sebuah data seharusnya disimpan.

---

## 1. Segregasi Sumber Kebenaran (Source of Truth)

LUMINA membagi data menjadi tiga lapisan yang diatur oleh teknologi yang berbeda:

### A. The Persistent Layer (PostgreSQL via Prisma)
*Fungsi:* Sumber Kebenaran Absolut (Source of Truth). Jika server mati total, data di sini tidak boleh hilang.
*Data yang disimpan:*
- Informasi pengguna dan otentikasi.
- Definisi Proyek (`Project`) dan parameter pemasaran.
- Daftar Prospek yang dikumpulkan (`Lead`).
- Sejarah Log Audit/Keamanan (`VRSentinelLog`).
- Konfigurasi finansial (Budget, Transaksi).

*Aturan Eksekusi:*
API FastAPI hanya berkomunikasi dengan PostgreSQL melalui antarmuka **Prisma Client Python**. Jangan membuat koneksi *raw SQL* kecuali untuk migrasi khusus atau optimasi *query* ekstrem.

### B. The Ephemeral & Broker Layer (Redis)
*Fungsi:* Memori jangka pendek untuk bot, sistem antrian (Message Broker), dan kecepatan pembacaan (*Caching*).
*Data yang disimpan:*
- Antrian tugas untuk Celery (Daftar bot yang harus dijalankan).
- *State* bot sementara (misal: "Bot A sedang memproses Lead ke-145").
- *Session login tokens*.
- *Rate limiting counters* (untuk mencegah API eksternal seperti Google/OpenAI memblokir IP kita).

*Aturan Eksekusi:*
Data di Redis bersifat *volatile* (bisa hilang kapan saja). Dilarang menjadikan Redis sebagai penyimpan data final. Jika Redis *restart*, bot harus bisa mengetahui di mana ia berhenti dengan mengecek data terakhir di PostgreSQL.

### C. The Cold Storage / Blob Layer (S3 / Cloud Storage / Local File System)
*Fungsi:* Tempat penyimpanan benda bermassa besar.
*Data yang disimpan:*
- File PDF brosur properti.
- Gambar Siteplan 3D.
- Video hasil editan AI.

*Aturan Eksekusi:*
Aplikasi tidak boleh menyimpan file Biner/Blob ke dalam *database* PostgreSQL. File harus diunggah ke *storage* ini, lalu URL absolut dan *hash* file-nya disimpan ke dalam tabel `SiteplanAsset` atau entitas terkait di Prisma.

---

## 2. Aliran Data Bot Otonom (How Bots Handle Data)

Pola komunikasi yang diwajibkan ketika sebuah Bot melakukan tugas berat:

1. **Pemanggilan API:** Frontend (Next.js) memanggil endpoint `/api/bots/start`.
2. **Pencatatan Awal (PostgreSQL):** FastAPI membuat status "INITIALIZING" untuk bot terkait ke database PostgreSQL agar tercatat di log.
3. **Delegasi (Redis):** FastAPI melempar pesan/tugas ini ke dalam antrian Redis (Message Broker). API merespons ke Frontend dengan `202 Accepted` ("Tugas diterima, sedang diproses"). Frontend tidak menunggu tugas selesai.
4. **Eksekusi (Celery):** Celery Worker (yang memantau Redis) mengambil pesan tersebut dan menjalankan skrip internal Bot (di `core_modules`).
5. **Proses (RAM -> Redis):** Bot melakukan proses komputasi. Setiap kali bot mendapatkan prospek baru, ia menampungnya di RAM sementara, lalu meng- *update* metrik persentase progres ke Redis.
6. **Finalisasi (PostgreSQL):** Setelah bot selesai, ia menuliskan hasil kerjanya (menyimpan 100 *Leads* baru) ke PostgreSQL dalam satu *batch transaction* menggunakan Prisma (untuk menghindari membuka dan menutup koneksi *database* ratusan kali).
7. **Notifikasi (WebSocket):** (Opsional) Sistem mengirim sinyal WebSocket ke Frontend Next.js untuk merefresh tampilan Dashboard bahwa prospek baru telah masuk.

---

## 3. Isolasi Data Multi-Tenant (Security)

LUMINA Overmind akan digunakan oleh berbagai Perusahaan/Agensi yang berbeda. Isolasi data sangat kritis.

- **Prinsip:** Data Agensi A tidak boleh bisa dilihat atau bocor ke Agensi B.
- **Implementasi Prisma:** Setiap *query* (pencarian, pembuatan, pembaruan) WAJIB difilter berdasarkan ID Perusahaan/Pengguna.
  - `prisma.project.find_many(where={'owner_id': user_company_id})`
- **Peringatan AI:** Saat men-*generate* kode backend untuk mengambil data, pastikan filter otorisasi dan identifikasi penyewa (tenant) selalu ada dalam parameter `where`.
