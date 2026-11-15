/**
 * ===================================================================
 * TASKFLOW MAIN APPLICATION CONTROLLER
 * Arsitektur: Modular JavaScript ES6 Modules
 * ===================================================================
 */

import { Config } from './config.js';
import { taskService } from './services/taskService.js';
import { validateTaskInput } from './utils/validator.js';
import { KpiComponent } from './components/kpi.js';
import { TaskTableComponent } from './components/taskTable.js';

class App {
  constructor() {
    this.tasks = [];
    this.kpi = new KpiComponent();
    this.table = new TaskTableComponent({
      onToggle: (id, status) => this.handleToggle(id, status),
      onEdit: (task) => this.handleEdit(task),
      onDelete: (id) => this.handleDelete(id)
    });

    this.bindDomElements();
    this.attachEventListeners();
  }

  bindDomElements() {
    // Form Elements
    this.form = document.getElementById('task-form');
    this.taskIdInput = document.getElementById('task-id');
    this.judulInput = document.getElementById('input-judul');
    this.deskripsiInput = document.getElementById('input-deskripsi');
    this.deadlineInput = document.getElementById('input-deadline');
    this.statusInput = document.getElementById('input-status');
    this.charCounter = document.getElementById('judul-counter');

    // UI Feedback & Buttons
    this.alertBox = document.getElementById('alert-error-box');
    this.alertMsg = document.getElementById('alert-error-message');
    this.btnSubmit = document.getElementById('btn-submit');
    this.btnSubmitText = document.getElementById('btn-submit-text');
    this.btnCancel = document.getElementById('btn-cancel');
    this.formHeading = document.getElementById('form-heading');
    this.formSubheading = document.getElementById('form-subheading');
    this.formBadgeMode = document.getElementById('form-badge-mode');

    // Search & Filter
    this.searchInput = document.getElementById('search-input');
    this.filterStatus = document.getElementById('filter-status');

    // Status Badge & Modal
    this.dbStatusBadge = document.getElementById('db-status-badge');
    this.dbStatusText = document.getElementById('db-status-text');
    this.configModal = document.getElementById('config-modal');
    this.configUrlInput = document.getElementById('config-url');
    this.configKeyInput = document.getElementById('config-key');
  }

  attachEventListeners() {
    // Form Events
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    if (this.judulInput) {
      this.judulInput.addEventListener('input', () => this.updateCharCount());
    }
    if (this.btnCancel) {
      this.btnCancel.addEventListener('click', () => this.resetForm());
    }

    // Search & Filter
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.filterAndRender());
    }
    if (this.filterStatus) {
      this.filterStatus.addEventListener('change', () => this.filterAndRender());
    }

    // Modal Trigger
    const btnOpenConfig = document.getElementById('btn-open-config');
    if (btnOpenConfig) {
      btnOpenConfig.addEventListener('click', () => this.openConfigModal());
    }
    const btnCloseModal = document.getElementById('btn-close-modal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => this.closeConfigModal());
    }
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    if (btnCancelModal) {
      btnCancelModal.addEventListener('click', () => this.closeConfigModal());
    }
    const btnSaveConfig = document.getElementById('btn-save-config');
    if (btnSaveConfig) {
      btnSaveConfig.addEventListener('click', () => this.saveConfig());
    }
  }

  async init() {
    this.updateStatusBadge();
    await this.fetchTasks();
  }

  updateStatusBadge() {
    if (!this.dbStatusBadge || !this.dbStatusText) return;

    if (taskService.isUsingSupabase()) {
      this.dbStatusText.textContent = "Supabase Connected";
      this.dbStatusBadge.className = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm transition-all";
    } else {
      this.dbStatusText.textContent = "Mode Local API / Demo";
      this.dbStatusBadge.className = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm transition-all cursor-pointer";
      this.dbStatusBadge.onclick = () => this.openConfigModal();
    }
  }

  async fetchTasks() {
    try {
      this.tasks = await taskService.getAllTasks();
      this.filterAndRender();
      this.kpi.update(this.tasks);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      this.showError("Gagal memuat tugas: " + err.message);
    }
  }

  filterAndRender() {
    const q = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
    const status = this.filterStatus ? this.filterStatus.value : 'All';

    const filtered = this.tasks.filter(task => {
      const matchQuery = (task.judul && task.judul.toLowerCase().includes(q)) ||
                         (task.deskripsi && task.deskripsi.toLowerCase().includes(q));
      const matchStatus = status === 'All' || task.status === status;
      return matchQuery && matchStatus;
    });

    this.table.render(filtered);
    this.kpi.update(this.tasks);
  }

  // TC-02: Form Submit dengan Validasi Judul
  async handleFormSubmit(e) {
    e.preventDefault();
    this.hideError();

    const id = this.taskIdInput.value;
    const taskData = {
      judul: this.judulInput.value,
      deskripsi: this.deskripsiInput.value,
      deadline: this.deadlineInput.value,
      status: this.statusInput.value
    };

    // Validasi TC-02
    const validation = validateTaskInput(taskData);
    if (!validation.isValid) {
      this.showError(validation.message);
      return;
    }

    this.setLoading(true);

    try {
      if (id) {
        await taskService.updateTask(id, taskData);
      } else {
        await taskService.createTask(taskData);
      }

      this.resetForm();
      await this.fetchTasks();
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      this.showError(err.message || "Gagal menyimpan data ke database.");
    } finally {
      this.setLoading(false);
    }
  }

  // TC-01: Toggle Status Cepat
  async handleToggle(id, currentStatus) {
    // Optimistic UI update
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks[idx].status = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      this.filterAndRender();
    }

    try {
      await taskService.toggleStatus(id, currentStatus);
    } catch (err) {
      console.error("Gagal toggle status:", err);
      await this.fetchTasks(); // Rollback jika ada error
    }
  }

  handleEdit(task) {
    this.hideError();
    this.taskIdInput.value = task.id;
    this.judulInput.value = task.judul;
    this.deskripsiInput.value = task.deskripsi || '';
    this.deadlineInput.value = task.deadline || '';
    this.statusInput.value = task.status;
    this.updateCharCount();

    if (this.formHeading) this.formHeading.textContent = `Edit Tugas #${task.id}`;
    if (this.formSubheading) this.formSubheading.textContent = "Perbarui rincian tugas yang dipilih";
    if (this.formBadgeMode) {
      this.formBadgeMode.textContent = "Mode Edit";
      this.formBadgeMode.className = "text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full";
    }
    if (this.btnSubmitText) this.btnSubmitText.textContent = "Perbarui Tugas";
    if (this.btnCancel) this.btnCancel.classList.remove('hidden');

    this.judulInput.focus();
  }

  async handleDelete(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    try {
      await taskService.deleteTask(id);
      await this.fetchTasks();
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus tugas: " + err.message);
    }
  }

  resetForm() {
    this.hideError();
    if (this.form) this.form.reset();
    if (this.taskIdInput) this.taskIdInput.value = '';
    this.updateCharCount();

    if (this.formHeading) this.formHeading.textContent = "Tambah Tugas Baru";
    if (this.formSubheading) this.formSubheading.textContent = "Kelola dan atur jadwal tugas harian Anda";
    if (this.formBadgeMode) {
      this.formBadgeMode.textContent = "Mode Tambah";
      this.formBadgeMode.className = "text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full";
    }
    if (this.btnSubmitText) this.btnSubmitText.textContent = "Simpan Tugas";
    if (this.btnCancel) this.btnCancel.classList.add('hidden');
  }

  updateCharCount() {
    const val = this.judulInput ? this.judulInput.value : '';
    if (this.charCounter) {
      this.charCounter.textContent = `${val.length}/150`;
    }
  }

  showError(message) {
    if (this.alertBox && this.alertMsg) {
      this.alertMsg.textContent = message;
      this.alertBox.classList.remove('hidden');
      if (this.judulInput) this.judulInput.focus();
    }
  }

  hideError() {
    if (this.alertBox) {
      this.alertBox.classList.add('hidden');
    }
  }

  setLoading(isLoading) {
    if (!this.btnSubmit) return;
    if (isLoading) {
      this.btnSubmit.disabled = true;
      this.btnSubmit.classList.add('opacity-75', 'cursor-not-allowed');
      if (this.btnSubmitText) this.btnSubmitText.textContent = "Menyimpan...";
    } else {
      this.btnSubmit.disabled = false;
      this.btnSubmit.classList.remove('opacity-75', 'cursor-not-allowed');
      if (this.btnSubmitText) {
        this.btnSubmitText.textContent = this.taskIdInput.value ? "Perbarui Tugas" : "Simpan Tugas";
      }
    }
  }

  // Modal Supabase Configuration
  openConfigModal() {
    if (!this.configModal) return;
    if (this.configUrlInput) this.configUrlInput.value = Config.getSupabaseUrl();
    if (this.configKeyInput) this.configKeyInput.value = Config.getSupabaseAnonKey();
    this.configModal.classList.remove('hidden');
  }

  closeConfigModal() {
    if (this.configModal) {
      this.configModal.classList.add('hidden');
    }
  }

  saveConfig() {
    const url = this.configUrlInput ? this.configUrlInput.value.trim() : '';
    const key = this.configKeyInput ? this.configKeyInput.value.trim() : '';

    if (!url || !key) {
      alert("Harap masukkan Project URL dan Anon Public Key Supabase.");
      return;
    }

    Config.saveCredentials(url, key);
    taskService.initClient();
    this.closeConfigModal();
    this.updateStatusBadge();
    this.fetchTasks();
  }
}

// Inisialisasi saat DOM siap
window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
