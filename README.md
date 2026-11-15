# TaskFlow - Aplikasi Manajemen To-Do List

Aplikasi web modern untuk manajemen dan pencatatan daftar tugas harian berbasis HTML5, CSS3, Modular JavaScript (ES6 Modules), Node.js Backend Server & REST API, serta database PostgreSQL Supabase. Dikembangkan sesuai dengan **Spesifikasi Kebutuhan Perangkat Lunak (SKPL) Aplikasi To-Do List**.

---

## 🏗️ Arsitektur Proyek (Clean & Modular Structure)

Proyek ini dibangun dengan struktur modular profesional (*Separation of Concerns*), memisahkan lapisan presentasi, utilitas keamanan, validasi, dan layanan data:

```text
todolist/
├── .env.example              # Template konfigurasi environment (SEC-02 Guardrails)
├── .gitignore                # Filter file sensitif & dependencies
├── package.json              # Konfigurasi proyek & dependency scripts
├── server.js                 # Backend Node.js Server & REST API (/api/tasks)
├── index.html                # Template antarmuka web modern (Tailwind CSS)
│
├── css/
│   └── styles.css            # Custom Design System, tipografi Inter & animasi
│
├── js/
│   ├── app.js                # Main Application Controller & UI Coordinator
│   ├── config.js             # Supabase Configuration & Credential Store (SEC-02)
│   ├── services/
│   │   └── taskService.js    # Data Service Layer (Supabase Client + REST API Fallback)
│   ├── utils/
│   │   ├── security.js       # Sanitasi Anti-XSS & Safe DOM helper (SEC-01)
│   │   └── validator.js      # Validasi TC-01, TC-02 & pemformat tanggal Indonesia (id-ID)
│   └── components/
│       ├── kpi.js            # Renderer 3 Kartu Ringkasan Metrik (Total, Pending, Completed)
│       └── taskTable.js      # Renderer Tabel Tugas, Toggle Status & Aksi Baris
│
├── tests/
│   ├── test_validation.js    # Suite pengujian otomatis (TC-01, TC-02, SEC-01)
│   └── test_api.http         # Endpoint API collection untuk QA testing
│
├── PRD.md                    # Product Requirements Document & QA Contract
├── DESIGN.md                 # Design System & UI Guidelines
├── RULES.md                  # AI Coding & Security Guardrails
├── STITCH_PROMPT.md          # Prompt UI/UX untuk Google Stitch
└── supabase_schema.sql       # Script SQL Supabase (Table, Constraints, RLS, Seed)
```

---

## 🚀 Panduan Menjalankan Proyek

### Opsi 1: Menjalankan dengan Node.js Server (Rekomendasi)
Aplikasi dilengkapi server backend bawaan dengan REST API siap pakai:

```bash
# 1. Jalankan server lokal
node server.js
```
Aplikasi akan aktif di `http://localhost:3000`. Server otomatis melayani file web sekaligus menyediakan REST API di `/api/tasks`.

---

### Opsi 2: Membuka Langsung di Browser / Live Server
Anda dapat langsung membuka file `index.html` menggunakan browser atau ekstensi *Live Server* di VS Code:
1. Klik kanan pada [`index.html`](index.html) -> **Open with Live Server**.
2. Masukkan URL dan Anon Key Supabase Anda via menu pengaturan (ikon gir) di pojok kanan atas aplikasi.

---

## 🗄️ Setup Database Supabase (PostgreSQL)

1. Buka dashboard proyek Anda di [Supabase](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buat query baru, salin dan jalankan seluruh isi file [`supabase_schema.sql`](supabase_schema.sql).
4. Tabel `tasks`, validasi check constraint `TC-01`/`TC-02`, Row Level Security (RLS), dan data awal akan langsung aktif.

---

## 🧪 Menjalankan Pengujian Otomatis (QA Tests)

Proyek ini telah dilengkapi script unit testing mandiri tanpa dependensi luar:

```bash
node tests/test_validation.js
```

**Hasil Pengujian:**
* ✅ **TC-01:** Toggle status tugas (*Pending* ⟷ *Completed*) berjalan instan.
* ✅ **TC-02:** Menolak form simpan jika judul kosong dengan pesan *"Judul tugas tidak boleh kosong!"*.
* ✅ **SEC-01:** Menetralkan serangan payload XSS seperti `<img src=x onerror=alert(1)>`.
* ✅ **SEC-02:** Frontend hanya menggunakan Public Anon Key, Service Role Key tidak pernah dimuat di browser.
