# Design System & UI Guidelines
## Aplikasi To-Do List Berbasis Web

---

### 1. Palet Warna (Tailwind CSS Architecture)

Aplikasi menggunakan palet warna standar Tailwind CSS versi 3.x dengan nuansa Slate dan Indigo untuk menciptakan antarmuka yang bersih, profesional, dan nyaman digunakan dalam waktu lama.

| Kategori Warna | Tailwind Class Token | Kode Hex (Acuan) | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `bg-slate-50` | `#F8FAFC` | Latar belakang seluruh halaman aplikasi. |
| **Card / Surface** | `bg-white` | `#FFFFFF` | Latar kartu form, kartu KPI, dan panel tabel. |
| **Border / Divider** | `border-slate-200` | `#E2E8F0` | Garis tepi kartu, pemisah baris tabel, dan input border. |
| **Primary Brand** | `bg-indigo-600`, `text-indigo-600` | `#4F46E5` | Tombol simpan, elemen aktif, focus ring, ikon brand. |
| **Primary Hover** | `hover:bg-indigo-700` | `#4338CA` | State hover tombol primer. |
| **Success / Completed** | `bg-emerald-50`, `text-emerald-700`, `border-emerald-200` | `#10B981` (Accent) | Badge "Completed", indikator koneksi database. |
| **Warning / Pending** | `bg-amber-50`, `text-amber-700`, `border-amber-200` | `#F59E0B` (Accent) | Badge "Pending", metrik tugas belum selesai. |
| **Danger / Error** | `bg-rose-50`, `text-rose-700`, `border-rose-200` | `#E11D48` (Accent) | Kotak pesan error validasi (`TC-02`), tombol hapus data. |
| **Typography Dark** | `text-slate-900` | `#0F172A` | Judul utama, heading tabel, nilai metrik KPI. |
| **Typography Body** | `text-slate-600` | `#475569` | Label input, rincian deskripsi tugas, teks sekunder. |
| **Typography Muted** | `text-slate-400` | `#94A3B8` | Placeholder, tanggal kadaluarsa, teks coret tugas selesai. |

---

### 2. Tipografi & Tata Letak Regional (Indonesian Localization)

1. **Font Family:**
   * Utama: `font-sans` (`Inter`, `Plus Jakarta Sans`, atau sistem UI sans-serif).
2. **Skala Tipografi:**
   * Page Heading: `text-2xl font-bold tracking-tight text-slate-900`
   * Card KPI Value: `text-3xl font-extrabold text-slate-900`
   * Section Subheading: `text-base font-semibold text-slate-800`
   * Body / Form Label: `text-sm font-medium text-slate-700`
   * Table Cell Content: `text-sm text-slate-600`
   * Timestamp & Hint: `text-xs text-slate-400`
3. **Format Lokalisasi Bahasa & Tanggal (`id-ID`):**
   * Format penulisan tanggal wajib menggunakan standar Indonesia:  
     Contoh: `15 Nov 2026` atau `15 November 2026`.
   * Implementasi JavaScript:
     ```javascript
     function formatTanggalID(dateString) {
       if (!dateString) return '-';
       const date = new Date(dateString);
       return new Intl.DateTimeFormat('id-ID', {
         day: 'numeric',
         month: 'short',
         year: 'numeric'
       }).format(date);
     }
     ```

---

### 3. Aturan Komponen & Interaktivitas UI

#### A. Alert Banner Validasi (`TC-02`)
* Komponen diletakkan di bagian atas form input.
* Kondisi Default: Kelas `hidden` aktif (tersembunyi).
* Kondisi Error: Kelas `hidden` dilepas, menampilkan ikon tanda seru merah dan pesan error:  
  `"Judul tugas tidak boleh kosong!"`
* Kelas Tailwind: `flex items-center gap-2 p-3 text-sm rounded-lg bg-rose-50 border border-rose-200 text-rose-700 animate-fadeIn`

#### B. Loading State pada Tombol
* Saat pengiriman data ke Supabase berlangsung (operasi async `insert`/`update`/`delete`), tombol aksi masuk ke *Loading State*:
  * Tambahkan atribut `disabled`.
  * Ganti teks tombol atau tampilkan *spinner* SVG animasi:
    ```html
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    <span>Memproses...</span>
    ```

#### C. Quick Toggle Checkbox State (`TC-01`)
* Checkbox interaktif di awal baris tugas.
* Status `Completed`: Checkbox tercentang, judul tugas diberi kelas `line-through text-slate-400 italic`.
* Status `Pending`: Checkbox tidak tercentang, judul tugas tampil reguler `text-slate-800 font-medium`.

#### D. Empty State Komponen
* Ditampilkan apabila data tabel kosong atau tidak ditemukan hasil pencarian:
  ```html
  <div class="text-center py-12 px-4">
    <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
    </div>
    <p class="text-sm font-medium text-slate-600">Belum ada tugas tercatat</p>
    <p class="text-xs text-slate-400 mt-1">Gunakan formulir di sisi kiri untuk menambahkan tugas baru.</p>
  </div>
  ```
