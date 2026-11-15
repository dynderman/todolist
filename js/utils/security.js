/**
 * ===================================================================
 * SECURITY UTILITIES
 * SEC-01 Compliance: Anti-XSS Sanitizer & Safe DOM Renderers
 * ===================================================================
 */

/**
 * Membersihkan karakter berbahaya agar aman dirender ke dalam HTML.
 * Mengubah &, <, >, ", ' menjadi entitas HTML.
 * @param {string|any} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Membuat elemen teks yang aman dari serangan XSS menggunakan properti textContent.
 * @param {string} tagName 
 * @param {string} text 
 * @param {string} className 
 * @returns {HTMLElement}
 */
export function createSafeElement(tagName, text, className = '') {
  const el = document.createElement(tagName);
  if (text !== undefined && text !== null) {
    el.textContent = text; // Kebal dari XSS payload seperti <img src=x onerror=alert(1)>
  }
  if (className) {
    el.className = className;
  }
  return el;
}
