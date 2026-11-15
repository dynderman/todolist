# TaskFlow - Aplikasi Manajemen To-Do List

Aplikasi web modern untuk manajemen dan pencatatan daftar tugas harian berbasis HTML5, Tailwind CSS, JavaScript Vanilla, dan database PostgreSQL Supabase. Dikembangkan sesuai dengan **Spesifikasi Kebutuhan Perangkat Lunak (SKPL) Aplikasi To-Do List**.

---

## 📁 Struktur Repositori

```text
├── PRD.md                 # Product Requirements Document & QA Contract
├── DESIGN.md              # Design System, Palet Warna Tailwind & UI Guidelines
├── RULES.md               # AI Coding & Security Guardrails (Anti-XSS, TC Rules)
├── STITCH_PROMPT.md       # Prompt Desain UI/UX untuk Google Stitch
├── supabase_schema.sql    # Script SQL PostgreSQL Supabase (Table, Constraints, RLS, Seed)
├── index.html             # Antarmuka Single-Page Application (SPA) Lengkap
└── README.md              # Dokumentasi & Petunjuk Penggunaan
```

---

## 🚀 Panduan Memulai Cepat

### 1. Setup Database di Supabase
1. Buka dashboard proyek Anda di [Supabase](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buat query baru, lalu salin dan jalankan seluruh isi file [`supabase_schema.sql`](supabase_schema.sql).
4. Tabel `tasks`, check constraint `TC-01`/`TC-02`, Row Level Security (RLS), dan data dummy awal akan langsung siap dipakai.

### 2. Jalankan Aplikasi Frontend
1. Buka file [`index.html`](index.html) langsung di browser Anda (atau gunakan ekstensi *Live Server* di VS Code).
2. Klik ikon gir (Pengaturan) di pojok kanan atas header aplikasi.
3. Masukkan **Project URL** dan **Anon Public Key** Supabase Anda.
4. Klik **Simpan & Hubungkan**. Indikator status akan berubah menjadi hijau bertuliskan **"Supabase Connected"**.

---

## 🧪 Verifikasi Pengujian & Keamanan

### 1. Fungsional Black Box Testing
* **TC-01 (Toggle Status Tugas):** Klik kotak centang (*checkbox*) di sebelah judul tugas. Status tugas akan langsung berganti antara `Pending` dan `Completed` secara instan tanpa memuat ulang halaman.
* **TC-02 (Form Judul Kosong):** Kosongkan input judul tugas pada formulir lalu klik tombol **Simpan Tugas**. Sistem akan menolak penyimpanan dan menampilkan Alert Error Box merah dengan pesan:  
  `"Judul tugas tidak boleh kosong!"`

### 2. Security Testing
* **SEC-01 (Uji Anti-XSS):** Masukkan payload `<img src=x onerror=alert(1)>` pada judul atau deskripsi tugas. Teks akan dirender secara aman sebagai string teks murni menggunakan manipulasi DOM `.textContent` dan `escapeHtml()`, tanpa mengeksekusi script.
* **SEC-02 (Audit Kredensial Frontend):** Aplikasi hanya menggunakan Public Anon Key. Tidak ada *Service Role Key* atau secret key yang disimpan di client-side.
