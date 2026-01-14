/**
 * FileManager - Handles PDF file upload and management
 */

class FileManager {
  constructor() {
    this.documents = new Map(); // id -> PDFDocument
    this.listeners = {
      filesAdded: [],
      fileRemoved: [],
      filesCleared: []
    };
  }

  /**
   * Validate PDF file
   */
  validateFile(file) {
    // Check file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error(`Invalid file type: ${file.name}. Please upload PDF files only.`);
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File too large: ${file.name}. Maximum size is 100MB.`);
    }

    return true;
  }

  /**
   * Load PDF files
   */
  async loadFiles(files) {
    const fileArray = Array.from(files);
    const results = [];

    for (const file of fileArray) {
      try {
        this.validateFile(file);
        const document = await this.loadFile(file);
        results.push({ success: true, document });
      } catch (error) {
        console.error(`Error loading ${file.name}:`, error);
        results.push({ success: false, filename: file.name, error: error.message });
      }
    }

    // Notify listeners
    const successful = results.filter(r => r.success).map(r => r.document);
    if (successful.length > 0) {
      this.emit('filesAdded', successful);
    }

    return results;
  }

  /**
   * Load a single PDF file
   */
  async loadFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const uint8Array = new Uint8Array(arrayBuffer);

          // Load with PDF.js
          const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
          const pdfDoc = await loadingTask.promise;

          // Create document object
          const document = {
            id: PDFCollatorUtils.generateId(),
            filename: file.name,
            fileSize: file.size,
            pageCount: pdfDoc.numPages,
            pdfDoc: pdfDoc,
            pdfBytes: arrayBuffer, // Keep for pdf-lib
            pages: [],
            loadedAt: new Date()
          };

          this.documents.set(document.id, document);
          resolve(document);
        } catch (error) {
          reject(new Error(`Failed to load PDF: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Remove a document
   */
  removeDocument(documentId) {
    const document = this.documents.get(documentId);
    if (!document) return;

    // Cleanup PDF.js resources
    if (document.pdfDoc) {
      document.pdfDoc.destroy();
    }

    this.documents.delete(documentId);
    this.emit('fileRemoved', documentId);
  }

  /**
   * Clear all documents
   */
  clearAll() {
    // Cleanup all PDF.js resources
    for (const document of this.documents.values()) {
      if (document.pdfDoc) {
        document.pdfDoc.destroy();
      }
    }

    this.documents.clear();
    this.emit('filesCleared');
  }

  /**
   * Get document by ID
   */
  getDocument(id) {
    return this.documents.get(id);
  }

  /**
   * Get all documents
   */
  getAllDocuments() {
    return Array.from(this.documents.values());
  }

  /**
   * Get total page count
   */
  getTotalPageCount() {
    return Array.from(this.documents.values())
      .reduce((sum, doc) => sum + doc.pageCount, 0);
  }

  /**
   * Event handling
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

// Make it available globally
window.FileManager = FileManager;
