# Product Requirements Document (PRD)
## Aplikasi Manajemen Tugas (To-Do List)

---

### 1. Identitas & Tujuan Aplikasi
* **Nama Aplikasi:** Web To-Do List Application
* **Ringkasan Sistem:** Aplikasi berbasis web responsif untuk mencatat, mengorganisir, dan mengelola daftar tugas harian secara mandiri. Aplikasi memungkinkan pengguna menambahkan tugas baru, memantau tenggat waktu (*deadline*), memperbarui status pengerjaan secara instan, mengedit rincian tugas, serta menghapus tugas yang sudah tidak diperlukan.
* **Capaian Utama (Main Achievement):** 
  * Terbangunnya aplikasi manajemen tugas berbasis web yang fungsional penuh dengan siklus CRUD utuh.
  * Mekanisme perubahan status dinamis (*Pending* ke *Completed* dan sebaliknya) secara cepat dan instan melalui antarmuka reaktif.
  * Validasi input formulir dan format tanggal *deadline* yang aman, konsisten, dan tahan uji.
* **Tujuan Aplikasi:**
  1. Menerapkan konsep CRUD (Create, Read, Update, Delete) yang solid pada entitas tugas.
  2. Mengimplementasikan pengelolaan status data yang sinkron antara UI dan database PostgreSQL Supabase.
  3. Menerapkan validasi input yang ketat baik di sisi *client-side* (JavaScript) maupun *database-level* (PostgreSQL Constraints).
* **Batasan Scope (Non-Functional Boundaries):**
  * Tidak mencakup kolaborasi atau pembagian tugas multi-pengguna (*single user / standalone mode*).
  * Tidak mencakup sinkronisasi kalender eksternal (Google Calendar, iCal, Outlook).
  * Tidak mencakup pengiriman notifikasi eksternal (*push notifications* browser atau email).

---

### 2. Spesifikasi Fungsional Lengkap (CRUD, Kalkulasi & Filter)

#### A. Pemetaan Kebutuhan SKPL
* **REQ-01 (Kelola Tugas):** Sistem menyediakan antarmuka dan logika backend untuk menambah tugas baru, menampilkan riwayat tugas, mengubah data rincian tugas, dan menghapus tugas.
* **REQ-02 (Status Tugas):** Sistem memfasilitasi perubahan status tugas antara `Pending` dan `Completed` secara dinamis dan instan.

#### B. Siklus Lengkap Fitur Sistem
1. **Fitur Create (Tambah Tugas):**
   * Pengguna menginputkan data tugas melalui formulir: Judul Tugas (wajib diisi, maks. 150 karakter), Deskripsi (opsional), Tanggal Deadline (opsional/format tanggal valid YYYY-MM-DD), dan Status awal (default: `Pending`).
   * Terdapat validasi *real-time*: jika judul kosong atau hanya berisi spasi, sistem membatalkan pengiriman data dan memunculkan kotak peringatan (*Alert Error Box*).
2. **Fitur Read (Visualisasi & Ringkasan Metrik):**
   * **3 Kartu Ringkasan (KPI Cards) di bagian atas:**
     * *Total Tugas:* Jumlah seluruh tugas yang tercatat di database.
     * *Tugas Pending:* Jumlah tugas yang berstatus `Pending`.
     * *Tugas Completed:* Jumlah tugas yang telah selesai (`Completed`).
   * **Tabel / Daftar Riwayat Tugas:** Menampilkan kolom Judul, Deskripsi singkat, Tanggal Deadline (diformat lokal Indonesia `id-ID`), Status Badge dengan warna pembeda, serta Tombol Aksi (Toggle Status Checkbox, Tombol Edit, Tombol Hapus).
3. **Fitur Update (Pembaruan Cepat & Form Edit):**
   * **Quick Toggle Checkbox (TC-01):** Mengklik kotak centang (*checkbox*) di baris data akan langsung memperbarui status pengerjaan tugas dari `Pending` ke `Completed` atau sebaliknya secara instan di Supabase tanpa perlu memuat ulang (*reload*) halaman.
   * **Form Edit Penuh:** Mengklik tombol *Edit* akan memindahkan data tugas terpilih ke dalam formulir input di kolom kiri, mengubah mode form menjadi *Mode Edit*, menyediakan tombol *Update Tugas* dan tombol *Batal Edit*.
4. **Fitur Delete (Penghapusan Tugas Terkontrol):**
   * Pengguna dapat menghapus baris tugas dengan mengklik tombol *Hapus*.
   * Sistem wajib menampilkan modal/dialog konfirmasi keamanan sebelum perintah penghapusan dieksekusi ke Supabase untuk mencegah ketidaksengajaan pengguna.
5. **Fitur Search & Filter Interaktif:**
   * **Pencarian Real-Time:** Input pencarian kata kunci berdasarkan `judul` dan `deskripsi` tugas secara instan menyaring daftar yang tampil di tabel.
   * **Filter Status:** Dropdown filter dengan opsi: *Semua Status*, *Pending*, dan *Completed*.

---

### 3. Spesifikasi Skema Data (Supabase PostgreSQL)

Nama tabel dan nama field menggunakan spesifikasi yang **100% identik dengan Modul 2 SKPL**:

* **Nama Tabel:** `tasks`
* **Deskripsi:** Menyimpan seluruh daftar tugas pengguna beserta status dan tenggat waktunya.

| Nama Kolom (Field) | Tipe Data PostgreSQL | Atribut & Constraint | Keterangan Fungsional |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` (Generated Always as Identity) | `PRIMARY KEY` | Identifier unik untuk setiap baris data tugas. |
| `judul` | `VARCHAR(150)` | `NOT NULL`, `CHECK (char_length(trim(judul)) > 0)` | Judul tugas (wajib diisi, tidak boleh kosong/hanya spasi). |
| `deskripsi` | `TEXT` | `NULLABLE` | Deskripsi atau catatan detail mengenai tugas. |
| `deadline` | `DATE` | `NULLABLE` | Tanggal batas akhir pengerjaan tugas (format: YYYY-MM-DD). |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'Pending'`, `CHECK (status IN ('Pending', 'Completed'))` | Status pengerjaan tugas (hanya menerima nilai `Pending` atau `Completed`). |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp pencatatan otomatis waktu pembuatan tugas. |

---

### 4. Kontrak Pengujian Black Box & Keamanan (QA Contract)

#### A. Pengujian Fungsional Black Box (SKPL Modul 5)
| ID Test | Skenario Pengujian | Input Data / Aksi | Hasil yang Diharapkan (Expected Result) | Status QA |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Toggle Status Tugas | Klik *Checkbox* tugas pada baris data | Status tugas berubah menjadi `'Completed'` secara instan di antarmuka dan database tanpa reload halaman. Jika diklik kembali, status kembali ke `'Pending'`. | **PASS** |
| **TC-02** | Form Judul Kosong | `judul`: `""` (string kosong atau spasi murni), klik tombol Simpan | Sistem membatalkan proses penyimpanan ke Supabase, menampilkan kotak peringatan (*Alert Error Box*) bertuliskan: *"Judul tugas tidak boleh kosong!"*, dan fokus kembali ke input judul. | **PASS** |

#### B. Pengujian Keamanan Sistem (Security Testing)
| ID Test | Aspek Uji | Payload / Metode Pengujian | Kriteria Lolos (Pass Criteria) |
| :--- | :--- | :--- | :--- |
| **SEC-01** | Uji Anti-XSS (Cross-Site Scripting) | Memasukkan payload berbahaya pada input `judul` dan `deskripsi`: `<img src=x onerror=alert(1)>` atau `<script>alert('xss')</script>` | Sistem tidak mengeksekusi script. Payload dirender sebagai teks biasa (*plain text*) murni menggunakan fungsi `escapeHtml()` atau manipulasi properti DOM `.textContent`. Tidak muncul kotak dialog `alert(1)`. |
| **SEC-02** | Audit Kredensial Frontend | Inspeksi kode sumber JavaScript dan file HTML | File frontend hanya memuat `SUPABASE_URL` dan `SUPABASE_ANON_KEY` (public key). Tidak ditemukan jejak `SUPABASE_SERVICE_ROLE_KEY` atau secret key lainnya di browser. |
