/**
 * ===================================================================
 * DATA SERVICE LAYER
 * Abstraksi akses data: Mendukung Supabase Client & REST API Fallback
 * ===================================================================
 */

import { Config } from '../config.js';
import { validateTaskInput, getToggledStatus } from '../utils/validator.js';

class TaskService {
  constructor() {
    this.supabase = null;
    this.initClient();
  }

  initClient() {
    if (Config.isSupabaseConfigured() && typeof window.supabase !== 'undefined') {
      try {
        this.supabase = window.supabase.createClient(
          Config.getSupabaseUrl(),
          Config.getSupabaseAnonKey()
        );
        return true;
      } catch (err) {
        console.error("Gagal inisialisasi Supabase SDK:", err);
        this.supabase = null;
        return false;
      }
    }
    this.supabase = null;
    return false;
  }

  isUsingSupabase() {
    return Boolean(this.supabase);
  }

  // READ: Ambil seluruh daftar tugas
  async getAllTasks() {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    // Fallback: Panggil Local REST API
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch {
      // Offline fallback
    }
    return [];
  }

  // CREATE: Tambah tugas baru
  async createTask(taskData) {
    const validation = validateTaskInput(taskData);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const payload = {
      judul: String(taskData.judul).trim(),
      deskripsi: taskData.deskripsi ? String(taskData.deskripsi).trim() : null,
      deadline: taskData.deadline || null,
      status: taskData.status === 'Completed' ? 'Completed' : 'Pending'
    };

    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('tasks')
        .insert([payload])
        .select();

      if (error) throw error;
      return data[0];
    }

    // REST API
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal membuat tugas");
    return result.data;
  }

  // UPDATE: Edit rincian tugas
  async updateTask(id, taskData) {
    const validation = validateTaskInput(taskData);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const payload = {
      judul: String(taskData.judul).trim(),
      deskripsi: taskData.deskripsi !== undefined ? String(taskData.deskripsi).trim() : null,
      deadline: taskData.deadline || null,
      status: taskData.status === 'Completed' ? 'Completed' : 'Pending'
    };

    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('tasks')
        .update(payload)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    }

    // REST API
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal memperbarui tugas");
    return result.data;
  }

  // TOGGLE: Pembaruan status instan (TC-01)
  async toggleStatus(id, currentStatus) {
    const newStatus = getToggledStatus(currentStatus);

    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data ? data[0] : { id, status: newStatus };
    }

    // REST API
    const res = await fetch(`/api/tasks/${id}/toggle`, {
      method: 'PATCH'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal mengubah status tugas");
    return result.data;
  }

  // DELETE: Hapus tugas
  async deleteTask(id) {
    if (this.supabase) {
      const { error } = await this.supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    }

    // REST API
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Gagal menghapus tugas");
    return true;
  }
}

export const taskService = new TaskService();
