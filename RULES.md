# AI Coding & Security Guardrails
## Pedoman Mutlak Pengkodean Aplikasi Web To-Do List

Dokumen ini merupakan aturan mutlak (hard requirements) yang WAJIB dipatuhi oleh AI Coding Assistant maupun programmer dalam mengembangkan kode sumber aplikasi ini. Pelanggaran terhadap poin-poin ini dikategorikan sebagai *Fatal Failure*.

---

### RULE 1: Kepatuhan Skema & Spesifikasi SKPL (100% Identik)
1. **Nama Tabel Database:** Wajib `tasks` (huruf kecil, persis seperti SKPL Modul 2).
2. **Nama Kolom/Field:** Wajib menggunakan nama field asli:
   * `id`
   * `judul`
   * `deskripsi`
   * `deadline`
   * `status`
   * `created_at`
   * *DILARANG* mengganti nama kolom menjadi bahasa Inggris (misal: `title`, `description`, `due_date`, atau `state`).
3. **Pesan Validasi Error:** Skenario penolakan judul kosong (`TC-02`) wajib menampilkan pesan:  
   `"Judul tugas tidak boleh kosong!"` (tidak boleh dikarang atau diganti dengan kalimat lain).

---

### RULE 2: Proteksi Mutlak Anti-XSS / Cross-Site Scripting (`SEC-01`)
1. **Dilarang Keras Penggunaan Metode Rentan:**
   * DILARANG menginjeksikan data dari input pengguna atau response database langsung ke dalam DOM menggunakan:
     * `element.innerHTML = ...`
     * `element.outerHTML = ...`
     * `document.write(...)`
2. **Metode Render yang Diwajibkan:**
   * Selalu gunakan pembuatan elemen aman melalui `document.createElement()` dan pengisian teks menggunakan properti `.textContent`:
     ```javascript
     const titleCell = document.createElement('span');
     titleCell.textContent = task.judul; // AMAN dari XSS
     ```
   * Jika rendering berbasis string HTML terpaksa digunakan untuk template terstruktur, SELURUH variabel input WAJIB melewati fungsi pembersih karakter (*sanitization function*):
     ```javascript
     function escapeHtml(str) {
       if (str === null || str === undefined) return '';
       return String(str)
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;');
     }
     ```
3. **Kriteria Kelulusan Pengujian:**
   * Payload `<img src=x onerror=alert(1)>` yang diinputkan ke form wajib tampil sebagai teks polos pada tabel dan tidak memicu eksekusi JavaScript dialog window.

---

### RULE 3: Validasi Logika Bertingkat (`TC-01` & `TC-02`)
1. **Jangan Bergantung pada Atribut HTML:**
   * Atribut HTML seperti `required`, `maxlength="150"`, atau `min` hanya berfungsi sebagai bantuan antarmuka awal dan sangat mudah dimanipulasi melalui browser DevTools (*Inspect Element*).
2. **Validasi Mutlak di Layer JavaScript:**
   * Sebelum memanggil fungsi Supabase SDK (`supabase.from('tasks').insert(...)` atau `.update(...)`), lakukan pemeriksaan logika secara ketat:
     ```javascript
     const judulInput = document.getElementById('input-judul').value.trim();
     if (!judulInput || judulInput.length === 0) {
       // Munculkan Alert Error Box
       showErrorAlert("Judul tugas tidak boleh kosong!");
       return; // Hentikan eksekusi segera
     }
     ```
3. **Mekanisme Reaktif Toggle Checkbox (`TC-01`):**
   * Event listener pada checkbox harus langsung mengubah status tugas:
     * Jika saat ini `'Pending'`, ubah menjadi `'Completed'`.
     * Jika saat ini `'Completed'`, kembalikan menjadi `'Pending'`.
   * Lakukan update ke Supabase, perbarui metrik KPI di layar, dan berikan indikator visual secara langsung.

---

### RULE 4: Keamanan Kredensial & Lingkungan Client (`SEC-02`)
1. **Kredensial yang Diizinkan:**
   * Hanya inisialisasikan Supabase Client menggunakan:
     * `SUPABASE_URL`
     * `SUPABASE_ANON_KEY` (Public Anonymous Key)
2. **Kredensial Terlarang:**
   * DILARANG KERAS mencantumkan `SUPABASE_SERVICE_ROLE_KEY` di file frontend (`index.html`, `app.js`, dll.). Kunci ini memberikan hak akses bypass Row Level Security dan tidak boleh bocor ke publik.
   * DILARANG menyimpan API Key rahasia pihak ketiga (Google Cloud Secret, Stitch Private Keys, dsb.) di sisi client.

---

### RULE 5: Manajemen State & Pengalaman Pengguna (UX Guardrails)
1. Setiap mutasi data (Create, Update, Delete) wajib memicu sinkronisasi ulang data di layar serta pembaruan otomatis ketiga kartu ringkasan KPI (Total, Pending, Completed).
2. Penghapusan baris data wajib menampilkan dialog konfirmasi standar `confirm("Apakah Anda yakin ingin menghapus tugas ini?")` atau modal custom sebelum mengirimkan request delete ke database.
3. Form input wajib menyediakan status reset bersih setelah proses simpan berhasil, dan tombol *Batal Edit* yang mengembalikan form ke *Mode Tambah Tugas*.
