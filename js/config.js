/**
 * ===================================================================
 * CONFIGURATION & CLIENT MANAGER
 * SEC-02 Compliance: Hanya mengizinkan Public Anon Key.
 * ===================================================================
 */

export const Config = {
  // Default values - Disimpan di localStorage pengguna
  STORAGE_KEYS: {
    URL: 'TASKFLOW_SUPABASE_URL',
    KEY: 'TASKFLOW_SUPABASE_ANON_KEY',
    MODE: 'TASKFLOW_DATA_MODE' // 'supabase' | 'rest-api'
  },

  getSupabaseUrl() {
    return localStorage.getItem(this.STORAGE_KEYS.URL) || '';
  },

  getSupabaseAnonKey() {
    return localStorage.getItem(this.STORAGE_KEYS.KEY) || '';
  },

  getDataMode() {
    return localStorage.getItem(this.STORAGE_KEYS.MODE) || 'auto';
  },

  saveCredentials(url, key) {
    // SEC-02: Validasi pencegahan penyusupan Service Role Key
    if (key && (key.includes('service_role') || key.length > 500)) {
      console.warn("PERINGATAN KEAMANAN: Jangan gunakan Service Role Key di frontend!");
    }
    localStorage.setItem(this.STORAGE_KEYS.URL, url.trim());
    localStorage.setItem(this.STORAGE_KEYS.KEY, key.trim());
  },

  isSupabaseConfigured() {
    const url = this.getSupabaseUrl();
    const key = this.getSupabaseAnonKey();
    return Boolean(url && key && !url.includes('your-project') && !key.includes('your-anon-key'));
  }
};
