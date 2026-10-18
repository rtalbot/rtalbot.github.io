/**
 * Utility Functions for PDF Collator
 */

const PDFCollatorUtils = {
  /**
   * Generate a unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Format date for display
   */
  formatDate(date) {
    if (!date) return 'No date';
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Truncate string
   */
  truncate(str, maxLength = 30) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  },

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Download file
   * The object URL is revoked after a delay: revoking it synchronously after
   * click() cancels the download in Firefox and Safari.
   */
  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  },

  /**
   * Local date stamp (YYYY-MM-DD). toISOString() uses UTC, which gives
   * tomorrow's date on US evenings.
   */
  localDateStamp(date = new Date()) {
    const pad = n => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  },

  /**
   * Make a user-typed name safe to use as a download filename
   */
  sanitizeFilename(name, fallback = 'collated') {
    let clean = String(name || '')
      .replace(/\.pdf$/i, '')
      .replace(/[\\/:*?"<>|\x00-\x1f]+/g, '-')
      .replace(/^[\s.]+|[\s.]+$/g, '')
      .trim();
    if (!clean) clean = fallback;
    return clean.substring(0, 150) + '.pdf';
  },

  /**
   * Parse a page list like "1-3, 6, 9-" into zero-based indices.
   * Out-of-range numbers are clamped away. Returns null if the text is invalid.
   */
  parsePageRange(text, pageCount) {
    const result = new Set();
    const parts = String(text || '').split(/[,;\s]+/).filter(Boolean);
    if (parts.length === 0) return null;

    for (const part of parts) {
      const m = part.match(/^(\d*)\s*[-\u2013]\s*(\d*)$|^(\d+)$/);
      if (!m) return null;
      let start, end;
      if (m[3]) {
        start = end = parseInt(m[3], 10);
      } else {
        start = m[1] ? parseInt(m[1], 10) : 1;
        end = m[2] ? parseInt(m[2], 10) : pageCount;
      }
      if (start > end) [start, end] = [end, start];
      for (let n = Math.max(1, start); n <= Math.min(pageCount, end); n++) {
        result.add(n - 1);
      }
    }
    return Array.from(result).sort((a, b) => a - b);
  },

  /**
   * Show toast notification (simple version)
   */
  showToast(message, type = 'info') {
    // For now, just use console
    // Could be enhanced with a proper toast library
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${message}`);
    
    // Could also show in UI
    if (type === 'error') {
      alert(`Error: ${message}`);
    }
  }
};

// Make it available globally
window.PDFCollatorUtils = PDFCollatorUtils;
