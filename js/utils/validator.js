/**
 * ===================================================================
 * VALIDATION & LOCALIZATION UTILITIES
 * Kepatuhan: TC-01 & TC-02
 * ===================================================================
 */

import { escapeHtml } from './security.js';

/**
 * Validasi form tugas sesuai aturan SKPL Modul 5 (TC-02)
 * @param {Object} data 
 * @returns {{ isValid: boolean, message?: string }}
 */
export function validateTaskInput(data) {
  const judul = data.judul ? String(data.judul).trim() : '';

  // Kontrak TC-02: Form Judul Kosong
  if (!judul || judul.length === 0) {
    return {
      isValid: false,
      message: "Judul tugas tidak boleh kosong!"
    };
  }

  if (judul.length > 150) {
    return {
      isValid: false,
      message: "Judul tugas tidak boleh melebihi 150 karakter!"
    };
  }

  // Validasi status
  if (data.status && !['Pending', 'Completed'].includes(data.status)) {
    return {
      isValid: false,
      message: "Status tugas harus 'Pending' atau 'Completed'!"
    };
  }

  return { isValid: true };
}

/**
 * Logika pembalikan status tugas (TC-01)
 * @param {string} currentStatus 
 * @returns {'Pending' | 'Completed'}
 */
export function getToggledStatus(currentStatus) {
  return currentStatus === 'Completed' ? 'Pending' : 'Completed';
}

/**
 * Format tanggal standar Indonesia (id-ID) sesuai DESIGN.md
 * @param {string} dateString 
 * @returns {string}
 */
export function formatTanggalID(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return escapeHtml(dateString);
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}
