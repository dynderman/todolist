/**
 * ===================================================================
 * KPI SUMMARY COMPONENT
 * Mengelola rendering 3 Kartu Ringkasan Metrik di bagian atas
 * ===================================================================
 */

export class KpiComponent {
  constructor() {
    this.totalEl = document.getElementById('stat-total');
    this.pendingEl = document.getElementById('stat-pending');
    this.completedEl = document.getElementById('stat-completed');
    this.percentageEl = document.getElementById('stat-percentage');
  }

  update(tasks = []) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (this.totalEl) this.totalEl.textContent = total;
    if (this.pendingEl) this.pendingEl.textContent = pending;
    if (this.completedEl) this.completedEl.textContent = completed;
    if (this.percentageEl) this.percentageEl.textContent = `${percentage}% tercapai`;
  }
}
