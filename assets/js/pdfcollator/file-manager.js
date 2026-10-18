/**
 * FileManager - Handles PDF file upload and management
 */

class FileManager {
  constructor() {
    this.documents = new Map(); // id -> PDFDocument
    this.nextColorIndex = 0;    // source-file colour chips
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
   * progressCallback(fraction, label) is called as each file finishes.
   */
  async loadFiles(files, progressCallback = null) {
    const fileArray = Array.from(files);
    const results = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      if (progressCallback) {
        progressCallback(i / fileArray.length, `Reading ${file.name}`);
      }
      try {
        this.validateFile(file);
        const document = await this.loadFile(file);
        results.push({ success: true, document });
      } catch (error) {
        console.warn(`Could not load ${file.name}:`, error);
        results.push({ success: false, filename: file.name, error: error.message });
      }
    }

    if (progressCallback) progressCallback(1, 'Loaded');

    // Notify listeners
    const successful = results.filter(r => r.success).map(r => r.document);
    if (successful.length > 0) {
      this.emit('filesAdded', successful);
    }

    return results;
  }

  /**
   * Load a single PDF file
   *
   * pdf.js transfers the bytes it is given to its worker, which detaches the
   * underlying ArrayBuffer. It therefore gets its own copy, and the original
   * stays usable by pdf-lib for export.
   */
  async loadFile(file) {
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      throw new Error('the file could not be read from disk.');
    }

    // Parse with pdf-lib first: it is what builds the output, and it refuses
    // encrypted files that pdf.js would happily preview.
    let libDoc;
    try {
      libDoc = await PDFLib.PDFDocument.load(arrayBuffer, { updateMetadata: false });
    } catch (error) {
      if (error && (error.name === 'EncryptedPDFError' || /encrypt/i.test(error.message))) {
        throw new Error('it is password-protected or encrypted. Remove the protection (for example open it and "Print to PDF") and add it again.');
      }
      throw new Error('it does not look like a valid PDF. It may be damaged or only partly downloaded.');
    }

    let pdfDoc;
    try {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
      pdfDoc = await loadingTask.promise;
    } catch (error) {
      if (error && error.name === 'PasswordException') {
        throw new Error('it is password-protected. Remove the password and add it again.');
      }
      throw new Error('it does not look like a valid PDF. It may be damaged or only partly downloaded.');
    }

    if (pdfDoc.numPages === 0 || libDoc.getPageCount() === 0) {
      pdfDoc.destroy();
      throw new Error('it has no pages.');
    }

    const document = {
      id: PDFCollatorUtils.generateId(),
      filename: file.name,
      fileSize: file.size,
      pageCount: pdfDoc.numPages,
      pdfDoc: pdfDoc,
      libDoc: libDoc,        // pdf-lib copy, reused for export
      pdfBytes: arrayBuffer, // Keep for pdf-lib
      colorIndex: this.nextColorIndex++ % FileManager.COLOR_COUNT,
      pages: [],
      loadedAt: new Date()
    };

    this.documents.set(document.id, document);
    return document;
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
    this.nextColorIndex = 0;
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

// Number of distinct source colours (see .src-color-N in pdfcollator.css)
FileManager.COLOR_COUNT = 8;

// Make it available globally
window.FileManager = FileManager;
