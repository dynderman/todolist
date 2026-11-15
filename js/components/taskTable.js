/**
 * ===================================================================
 * TASK TABLE & LIST COMPONENT
 * SEC-01 Compliant: Render aman dengan createSafeElement
 * TC-01 Compliant: Checkbox Toggle Real-time
 * ===================================================================
 */

import { createSafeElement } from '../utils/security.js';
import { formatTanggalID } from '../utils/validator.js';

export class TaskTableComponent {
  constructor({ onToggle, onEdit, onDelete }) {
    this.tbody = document.getElementById('task-table-body');
    this.emptyState = document.getElementById('empty-state');
    this.countBadge = document.getElementById('table-count-badge');
    this.onToggle = onToggle;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }

  render(tasks = []) {
    if (!this.tbody) return;
    this.tbody.innerHTML = '';

    if (this.countBadge) {
      this.countBadge.textContent = `${tasks.length} Tugas`;
    }

    if (tasks.length === 0) {
      if (this.emptyState) this.emptyState.classList.remove('hidden');
      return;
    }

    if (this.emptyState) this.emptyState.classList.add('hidden');

    tasks.forEach(task => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-50/75 transition-colors border-b border-slate-100";

      const isCompleted = task.status === 'Completed';

      // 1. Checkbox Kolom (TC-01)
      const tdCheck = document.createElement('td');
      tdCheck.className = "py-3.5 px-4 text-center";
      const checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.checked = isCompleted;
      checkbox.className = "w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer";
      checkbox.addEventListener('change', () => this.onToggle(task.id, task.status));
      tdCheck.appendChild(checkbox);

      // 2. Judul & Deskripsi Kolom (SEC-01: Kebal XSS via createSafeElement)
      const tdContent = document.createElement('td');
      tdContent.className = "py-3.5 px-4";

      const titleClasses = isCompleted 
        ? "font-medium line-through text-slate-400 italic text-sm" 
        : "font-medium text-slate-900 text-sm";
      const titleEl = createSafeElement('div', task.judul, titleClasses);
      tdContent.appendChild(titleEl);

      if (task.deskripsi) {
        const descEl = createSafeElement('div', task.deskripsi, "text-xs text-slate-500 mt-0.5 line-clamp-2");
        tdContent.appendChild(descEl);
      }

      // Status Pill Badge
      const statusBadge = createSafeElement(
        'span',
        task.status,
        isCompleted
          ? "inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full"
          : "inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full"
      );
      tdContent.appendChild(statusBadge);

      // 3. Deadline Kolom
      const tdDeadline = createSafeElement(
        'td',
        formatTanggalID(task.deadline),
        "py-3.5 px-4 text-xs font-medium text-slate-600"
      );

      // 4. Aksi Kolom
      const tdAction = document.createElement('td');
      tdAction.className = "py-3.5 px-4 text-center";

      const btnGroup = document.createElement('div');
      btnGroup.className = "inline-flex items-center gap-1";

      // Tombol Edit
      const btnEdit = document.createElement('button');
      btnEdit.title = "Edit Tugas";
      btnEdit.className = "p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition";
      btnEdit.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>`;
      btnEdit.addEventListener('click', () => this.onEdit(task));

      // Tombol Hapus
      const btnDelete = document.createElement('button');
      btnDelete.title = "Hapus Tugas";
      btnDelete.className = "p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition";
      btnDelete.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;
      btnDelete.addEventListener('click', () => this.onDelete(task.id));

      btnGroup.appendChild(btnEdit);
      btnGroup.appendChild(btnDelete);
      tdAction.appendChild(btnGroup);

      tr.appendChild(tdCheck);
      tr.appendChild(tdContent);
      tr.appendChild(tdDeadline);
      tr.appendChild(tdAction);

      this.tbody.appendChild(tr);
    });
  }
}
