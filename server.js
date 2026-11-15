/**
 * ===================================================================
 * TASKFLOW - LOCAL NODE.JS SERVER & REST API
 * Arsitektur: Native Node.js (Zero external dependency required)
 * Sesuai Tech Stack SKPL Bagian 4: Backend PHP / Node.js
 * ===================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

// In-memory fallback database jika Supabase belum terhubung
let inMemoryTasks = [
  {
    id: 1,
    judul: "Menyelesaikan Dokumen SKPL Proyek",
    deskripsi: "Menyusun spesifikasi kebutuhan perangkat lunak, perancangan database, serta skenario pengujian black box.",
    deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: "Completed",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    judul: "Implementasi Antarmuka Tailwind CSS",
    deskripsi: "Membuat layout responsif dua kolom dengan form input tugas dan tabel ringkasan metrik.",
    deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    status: "Pending",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    judul: "Pengujian Black Box dan Anti-XSS",
    deskripsi: "Menjalankan skenario TC-01, TC-02, serta menguji ketahanan input terhadap payload script berbahaya.",
    deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    status: "Pending",
    created_at: new Date().toISOString()
  }
];
let nextId = 4;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.sql': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // Set Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // ================= REST API ROUTES (/api/tasks) =================
  if (pathname.startsWith('/api/tasks')) {
    const idMatch = pathname.match(/^\/api\/tasks\/(\d+)(?:\/(toggle))?$/);

    try {
      // 1. GET /api/tasks - Read All Tasks
      if (method === 'GET' && pathname === '/api/tasks') {
        const query = parsedUrl.query;
        let results = [...inMemoryTasks];

        if (query.status && query.status !== 'All') {
          results = results.filter(t => t.status === query.status);
        }
        if (query.q) {
          const q = query.q.toLowerCase();
          results = results.filter(t => 
            t.judul.toLowerCase().includes(q) || 
            (t.deskripsi && t.deskripsi.toLowerCase().includes(q))
          );
        }

        return sendJson(res, 200, { success: true, data: results });
      }

      // 2. POST /api/tasks - Create Task (REQ-01 & TC-02)
      if (method === 'POST' && pathname === '/api/tasks') {
        const body = await parseRequestBody(req);

        // Validasi TC-02: Form Judul Kosong
        const judul = body.judul ? body.judul.trim() : '';
        if (!judul || judul.length === 0) {
          return sendJson(res, 400, {
            success: false,
            message: "Judul tugas tidak boleh kosong!"
          });
        }

        if (judul.length > 150) {
          return sendJson(res, 400, {
            success: false,
            message: "Judul tugas maksimal 150 karakter!"
          });
        }

        const status = body.status === 'Completed' ? 'Completed' : 'Pending';
        const newTask = {
          id: nextId++,
          judul: judul,
          deskripsi: body.deskripsi ? String(body.deskripsi).trim() : null,
          deadline: body.deadline || null,
          status: status,
          created_at: new Date().toISOString()
        };

        inMemoryTasks.unshift(newTask);
        return sendJson(res, 201, { success: true, data: newTask });
      }

      // 3. PATCH /api/tasks/:id/toggle - Toggle Status (TC-01)
      if (method === 'PATCH' && idMatch && idMatch[2] === 'toggle') {
        const id = parseInt(idMatch[1], 10);
        const task = inMemoryTasks.find(t => t.id === id);

        if (!task) {
          return sendJson(res, 404, { success: false, message: "Tugas tidak ditemukan" });
        }

        task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
        return sendJson(res, 200, { success: true, data: task });
      }

      // 4. PUT /api/tasks/:id - Update Task (REQ-01)
      if (method === 'PUT' && idMatch && !idMatch[2]) {
        const id = parseInt(idMatch[1], 10);
        const taskIndex = inMemoryTasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
          return sendJson(res, 404, { success: false, message: "Tugas tidak ditemukan" });
        }

        const body = await parseRequestBody(req);
        const judul = body.judul ? body.judul.trim() : '';
        if (!judul || judul.length === 0) {
          return sendJson(res, 400, {
            success: false,
            message: "Judul tugas tidak boleh kosong!"
          });
        }

        inMemoryTasks[taskIndex] = {
          ...inMemoryTasks[taskIndex],
          judul: judul,
          deskripsi: body.deskripsi !== undefined ? String(body.deskripsi).trim() : inMemoryTasks[taskIndex].deskripsi,
          deadline: body.deadline !== undefined ? body.deadline : inMemoryTasks[taskIndex].deadline,
          status: body.status === 'Completed' ? 'Completed' : 'Pending'
        };

        return sendJson(res, 200, { success: true, data: inMemoryTasks[taskIndex] });
      }

      // 5. DELETE /api/tasks/:id - Delete Task (REQ-01)
      if (method === 'DELETE' && idMatch && !idMatch[2]) {
        const id = parseInt(idMatch[1], 10);
        const initialLength = inMemoryTasks.length;
        inMemoryTasks = inMemoryTasks.filter(t => t.id !== id);

        if (inMemoryTasks.length === initialLength) {
          return sendJson(res, 404, { success: false, message: "Tugas tidak ditemukan" });
        }

        return sendJson(res, 200, { success: true, message: "Tugas berhasil dihapus" });
      }

    } catch (err) {
      console.error("API Error:", err);
      return sendJson(res, 500, { success: false, message: "Internal server error" });
    }
  }

  // ================= STATIC FILE SERVER =================
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, safePath);

  // Security check: ensure path stays within ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found - File tidak ditemukan.');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🚀 TaskFlow Server aktif di http://localhost:${PORT}`);
  console.log(`  📂 Static Files : ${ROOT_DIR}`);
  console.log(`  🔗 REST API     : http://localhost:${PORT}/api/tasks`);
  console.log(`=======================================================`);
});
