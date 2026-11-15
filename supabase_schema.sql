-- ===================================================================
-- SCRIPT PENYIAPAN DATABASE SUPABASE (POSTGRESQL)
-- APLIKASI: TO-DO LIST MANAGEMENT SYSTEM
-- KEPATUHAN: 100% SESUAI SKPL MODUL 2, VALIDASI TC-01/TC-02 & RLS
-- ===================================================================

-- 1. PEMBUATAN TABEL `tasks`
CREATE TABLE IF NOT EXISTS public.tasks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    judul VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Database Level Constraint: Judul tidak boleh berupa string kosong atau hanya spasi (TC-02 Defense)
    CONSTRAINT check_judul_tidak_kosong CHECK (char_length(trim(judul)) > 0),

    -- Database Level Constraint: Status hanya boleh bernilai 'Pending' atau 'Completed' (TC-01 Integrity)
    CONSTRAINT check_status_valid CHECK (status IN ('Pending', 'Completed'))
);

-- Memberikan komentar deskripsi pada tabel dan kolom sesuai SKPL
COMMENT ON TABLE public.tasks IS 'Menyimpan seluruh daftar tugas harian pengguna sesuai SKPL Modul 2';
COMMENT ON COLUMN public.tasks.id IS 'Primary Key unik tugas';
COMMENT ON COLUMN public.tasks.judul IS 'Judul tugas (maks. 150 karakter, wajib)';
COMMENT ON COLUMN public.tasks.deskripsi IS 'Deskripsi rincian tugas';
COMMENT ON COLUMN public.tasks.deadline IS 'Tanggal batas penyelesaian tugas';
COMMENT ON COLUMN public.tasks.status IS 'Status pengerjaan tugas (Pending / Completed)';
COMMENT ON COLUMN public.tasks.created_at IS 'Waktu pencatatan data tugas';

-- ===================================================================
-- 2. PENGATURAN INDEX UNTUK PERFORMA PENCARIAN & FILTER
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON public.tasks (deadline);

-- ===================================================================
-- 3. MENGAKTIFKAN FITUR ROW LEVEL SECURITY (RLS)
-- ===================================================================
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Menghapus policy lama jika ada untuk menghindari duplikasi saat re-run
DROP POLICY IF EXISTS "Allow anon public select" ON public.tasks;
DROP POLICY IF EXISTS "Allow anon public insert" ON public.tasks;
DROP POLICY IF EXISTS "Allow anon public update" ON public.tasks;
DROP POLICY IF EXISTS "Allow anon public delete" ON public.tasks;

-- ===================================================================
-- 4. KEBIJAKAN AKSES (POLICIES) UNTUK ROLE `anon` (WORKSHOP & DEMO)
-- Tetap mengunci constraint keamanan pada klausa WITH CHECK
-- ===================================================================

-- Policy READ: Mengizinkan siapa saja (anon) membaca daftar tugas
CREATE POLICY "Allow anon public select" 
ON public.tasks 
FOR SELECT 
TO anon 
USING (true);

-- Policy INSERT: Mengizinkan penambahan tugas baru dengan validasi judul & status
CREATE POLICY "Allow anon public insert" 
ON public.tasks 
FOR INSERT 
TO anon 
WITH CHECK (
    char_length(trim(judul)) > 0 AND 
    status IN ('Pending', 'Completed')
);

-- Policy UPDATE: Mengizinkan pembaruan data & toggle status dengan validasi ketat
CREATE POLICY "Allow anon public update" 
ON public.tasks 
FOR UPDATE 
TO anon 
USING (true)
WITH CHECK (
    char_length(trim(judul)) > 0 AND 
    status IN ('Pending', 'Completed')
);

-- Policy DELETE: Mengizinkan penghapusan tugas
CREATE POLICY "Allow anon public delete" 
ON public.tasks 
FOR DELETE 
TO anon 
USING (true);

-- ===================================================================
-- 5. DATA AWAL (SEED / DUMMY DATA)
-- Memberikan data realistis agar aplikasi langsung terisi saat pertama dijalankan
-- ===================================================================
INSERT INTO public.tasks (judul, deskripsi, deadline, status)
VALUES 
    (
        'Menyelesaikan Dokumen SKPL Proyek', 
        'Menyusun spesifikasi kebutuhan perangkat lunak, perancangan database, serta skenario pengujian black box.', 
        CURRENT_DATE + INTERVAL '1 day', 
        'Completed'
    ),
    (
        'Implementasi Antarmuka Tailwind CSS', 
        'Membuat layout responsif dua kolom dengan form input tugas dan tabel ringkasan metrik.', 
        CURRENT_DATE + INTERVAL '3 days', 
        'Pending'
    ),
    (
        'Pengujian Black Box dan Anti-XSS', 
        'Menjalankan skenario TC-01, TC-02, serta menguji ketahanan input terhadap payload script berbahaya.', 
        CURRENT_DATE + INTERVAL '5 days', 
        'Pending'
    );
