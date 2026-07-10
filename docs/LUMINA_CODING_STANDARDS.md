# LUMINA CODING STANDARDS
*Strict Engineering Guardrails for Human & AI Developers*

Dokumen ini mendefinisikan aturan mutlak untuk penulisan kode dalam ekosistem LUMINA Overmind. AI Assistant (Windsurf/Cursor) dan developer manusia WAJIB mengikuti standar ini tanpa deviasi, untuk memastikan Monorepo tetap *maintainable* dan aman.

## 1. General Principles
- **Fail Fast, Fail Loud:** Jangan menyembunyikan *error* dengan `except Exception: pass`. Biarkan sistem gagal dengan pesan yang jelas agar *Sentinel* (Sistem Log) bisa menangkapnya.
- **Stateless by Design:** Aplikasi API (FastAPI) tidak boleh menyimpan status di dalam memori (RAM) variabel global. Jika ada status yang perlu diingat lintas-*request*, simpan di **Redis** atau **PostgreSQL**.
- **Zero Trust Security:** Anggap semua input dari klien (Dashboard) berbahaya. Validasi semua *payload* di level API menggunakan Pydantic.

---

## 2. Backend Rules (Python / FastAPI)

### 2.1. Type Hinting Wajib
Python di Lumina diperlakukan seperti bahasa *strongly typed*. Dilarang keras menulis fungsi tanpa mendeklarasikan tipe parameter dan tipe kembalian.
✅ **BENAR:**
```python
async def process_lead(lead_id: str, priority_score: int) -> Dict[str, Any]:
```
❌ **SALAH:**
```python
async def process_lead(lead_id, priority_score):
```

### 2.2. Asynchronous I/O Only
Karena kita menjalankan 25 Bot secara simultan, pemblokiran *thread* akan membunuh performa *server*. 
Semua panggilan ke *database* (Prisma), file sistem, atau API eksternal (HTTP HTTPX) WAJIB menggunakan `await`. Jangan gunakan library *synchronous* seperti `requests` (ganti dengan `httpx` atau `aiohttp`).

### 2.3. Pydantic Everywhere
Jangan pernah menerima raw JSON (`dict`). Selalu definisikan skema Pydantic untuk *request* dan *response*.
Ini penting agar FastAPI bisa men-*generate* OpenAPI/Swagger docs yang akurat secara otomatis.

---

## 3. Frontend Rules (TypeScript / Next.js 14+)

### 3.1. Server Components vs Client Components
Gunakan fitur *App Router* Next.js dengan bijak:
- Defaultkan semua komponen menjadi **Server Components** (`.tsx` tanpa `'use client'`).
- Gunakan **Client Components** (tambahkan `'use client'` di baris paling atas) HANYA jika komponen membutuhkan interaktivitas (onClick, useState, useEffect, visualisasi 3D React Three Fiber).

### 3.2. State Management (SWR / React Query)
Hindari penggunaan Redux atau Context API global secara berlebihan.
Gunakan **SWR** (atau React Query) untuk mengambil, menyinkronkan, dan memperbarui (*mutate*) data dari API FastAPI. Biarkan perpustakaan ini yang mengurus status *loading*, *error*, dan *caching*.

### 3.3. Tailwind CSS & UI Consistency
- Dilarang keras menggunakan *inline styles* (`style={{ color: 'red' }}`).
- Semua *styling* wajib menggunakan kelas **Tailwind CSS**.
- Untuk antarmuka bot, patuhi palet warna desain (*Obsidian, Midnight, Neon Cyan*).

---

## 4. Security & Environment Variables (FATAL RULES)

### 4.1. No Hardcoded Secrets
**Ini adalah aturan paling fatal.** 
AI dan Developer dilarang keras mengetik API Key, Token, Password Database, atau koneksi eksternal langsung ke dalam kode sumber (`.py`, `.ts`, dll).
Semua *secret* HARUS dipanggil melalui sistem environment.

✅ **BENAR:**
```python
import os
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set in environment.")
```

### 4.2. Doppler Integration
Proyek ini dikonfigurasi untuk menarik variabel dari **Doppler** di lingkungan produksi. Selama masa pengembangan (lokal), `pnpm run dev` akan menarik dari file `.env`. 
Jangan pernah me- *commit* file `.env` ke Git (`.env` sudah dimasukkan ke `.gitignore`).

---

## 5. Prisma ORM & Database Schema
- **Migrasi:** Setiap kali ada perubahan pada file `schema.prisma`, developer wajib melakukan negosiasi ulang dengan arsitektur (jangan hapus kolom sembarangan, gunakan `@deprecated` atau biarkan opsional `?` untuk mencegah *breaking changes*).
- **Naming Convention Database:** 
  - Nama model/tabel: PascalCase tunggal (misal: `Project`, bukan `Projects`).
  - Nama kolom: camelCase (misal: `namaProyek`) atau snake_case (`target_market`). Konsisten dengan konvensi Prisma yang berlaku di proyek.

---

## 6. Git Workflow
1. Buat branch baru dari `main` dengan format: `feature/nama-fitur`, `fix/deskripsi-bug`, atau `bot/nama-bot`.
2. Lakukan *commit* kecil namun sering.
3. Pesan *commit* harus bermakna dan mematuhi *conventional commits* (contoh: `feat(api): add auth endpoint`, `fix(ui): resolve dashboard crash`).
4. PR (Pull Request) wajib direview secara logika sebelum di- *merge* ke `main`.
