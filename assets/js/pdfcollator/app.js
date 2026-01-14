/**
 * PDFCollatorApp - Main application controller
 */

class PDFCollatorApp {
  constructor() {
    // Initialize modules
    this.fileManager = new FileManager();
    this.analyzer = new PDFAnalyzer();
    this.renderer = new PDFRenderer();
    this.collator = new PDFCollator();
    this.uiController = new UIController(this.fileManager, this.renderer);
    this.exporter = new PDFExporter(this.fileManager);

    // State
    this.currentCollationResult = null;
  }

  /**
   * Initialize the application
   */
  initialize() {
    console.log('🚀 Initializing PDF Collator...');

    // Check dependencies (no alert, just log)
    if (!this.checkDependencies()) {
      console.error('❌ Required libraries not loaded. Please check console for details.');
      return;
    }

    // Set up event listeners
    this.setupFileUpload();
    this.setupCollationControls();
    this.setupExportControls();
    this.uiController.initializeModalHandlers();

    // Set up file manager listeners
    this.fileManager.on('filesAdded', (documents) => {
      this.uiController.updateFileList();
      console.log(`✅ Added ${documents.length} document(s)`);
    });

    this.fileManager.on('fileRemoved', (documentId) => {
      this.uiController.updateFileList();
      this.renderer.clearDocumentCache(documentId);
      
      // Clear preview if no files remain
      if (this.fileManager.getAllDocuments().length === 0) {
        this.clearPreview();
      }
    });

    this.fileManager.on('filesCleared', () => {
      this.uiController.updateFileList();
      this.renderer.clearCache();
      this.clearPreview();
    });

    console.log('✅ PDF Collator initialized');
  }

  /**
   * Check if required dependencies are loaded
   */
  checkDependencies() {
    const required = [
      { name: 'pdfjsLib', label: 'PDF.js' },
      { name: 'PDFLib', label: 'pdf-lib' },
      { name: 'Sortable', label: 'Sortable.js' },
      { name: 'PDFCollatorUtils', label: 'Utils' }
    ];

    for (const dep of required) {
      if (typeof window[dep.name] === 'undefined') {
        console.error(`Missing dependency: ${dep.label} (${dep.name})`);
        return false;
      }
    }

    return true;
  }

  /**
   * Set up file upload handlers
   * Note: Primary handlers are set up directly in HTML for reliability
   * This is a backup/secondary setup
   */
  setupFileUpload() {
    console.log('App: setupFileUpload called (backup handlers)');
    // Primary handlers are set up directly in the HTML page
    // This method now just logs that setup was called
  }

  /**
   * Handle uploaded files
   */
  async handleFiles(files) {
    this.uiController.showLoading();
    this.uiController.updateProgress(0, 'Loading PDFs');

    try {
      const results = await this.fileManager.loadFiles(files);

      // Show errors if any
      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        const errorMsg = errors.map(e => `${e.filename}: ${e.error}`).join('\n');
        alert(`Some files could not be loaded:\n\n${errorMsg}`);
      }

      // Show success message
      const successful = results.filter(r => r.success);
      if (successful.length > 0) {
        console.log(`✅ Loaded ${successful.length} PDF(s) successfully`);
      }

    } catch (error) {
      console.error('Error handling files:', error);
      alert(`Error: ${error.message}`);
    } finally {
      this.uiController.hideProgress();
      this.uiController.hideLoading();
    }
  }

  /**
   * Set up collation controls
   */
  setupCollationControls() {
    const applyBtn = document.getElementById('apply-collation');
    const strategySelect = document.getElementById('strategy-select');
    const clearBtn = document.getElementById('clear-all');

    // Apply collation
    applyBtn.addEventListener('click', async () => {
      await this.applyCollation();
    });

    // Strategy change
    strategySelect.addEventListener('change', () => {
      // If pages are already displayed, reapply collation
      if (this.currentCollationResult) {
        this.applyCollation();
      }
    });

    // Clear all
    clearBtn.addEventListener('click', () => {
      if (confirm('Remove all files and start over?')) {
        this.fileManager.clearAll();
      }
    });
  }

  /**
   * Set up export controls
   */
  setupExportControls() {
    const exportBtn = document.getElementById('export-pdf');

    exportBtn.addEventListener('click', async () => {
      await this.exportPDF();
    });
  }

  /**
   * Apply collation
   */
  async applyCollation() {
    const documents = this.fileManager.getAllDocuments();
    
    if (documents.length === 0) {
      alert('Please upload PDF files first.');
      return;
    }

    this.uiController.showLoading();
    this.uiController.updateProgress(0, 'Analyzing PDFs');

    try {
      // Analyze all documents
      const allPages = await this.analyzer.getAllPages(documents, (progress) => {
        this.uiController.updateProgress(progress * 0.5, 'Analyzing PDFs');
      });

      // Get selected strategy
      const strategy = document.getElementById('strategy-select').value;

      // Apply collation
      this.uiController.updateProgress(0.6, 'Collating pages');
      this.currentCollationResult = this.collator.collate(allPages, documents, strategy);

      // Display results
      this.uiController.updateProgress(0.8, 'Rendering previews');
      await this.uiController.displayPages(
        this.currentCollationResult.orderedPages, 
        documents
      );

      // Update statistics
      this.uiController.updateStatistics(
        this.currentCollationResult.statistics,
        strategy
      );

      // Show export button
      this.uiController.showExportControls();

      this.uiController.updateProgress(1.0, 'Complete');

      console.log(`✅ Collated ${this.currentCollationResult.orderedPages.length} pages using ${strategy} strategy`);

    } catch (error) {
      console.error('Error during collation:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        this.uiController.hideProgress();
        this.uiController.hideLoading();
      }, 500);
    }
  }

  /**
   * Export collated PDF
   */
  async exportPDF() {
    if (!this.currentCollationResult) {
      alert('Please collate pages first.');
      return;
    }

    // Get current page order (may have been manually reordered)
    const orderedPages = this.uiController.getCurrentPages();

    this.uiController.showLoading();
    this.uiController.updateProgress(0, 'Creating PDF');

    try {
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `collated-${timestamp}.pdf`;

      // Export
      this.uiController.updateProgress(0.5, 'Merging pages');
      const result = await this.exporter.exportPDF(orderedPages, filename);

      if (result.success) {
        this.uiController.updateProgress(1.0, 'Download started');
        console.log(`✅ Exported ${orderedPages.length} pages to ${result.filename}`);
        
        // Show success briefly
        setTimeout(() => {
          this.uiController.hideProgress();
          alert(`PDF exported successfully!\n\n${orderedPages.length} pages saved to ${result.filename}`);
        }, 500);
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert(`Failed to export PDF: ${error.message}`);
    } finally {
      setTimeout(() => {
        this.uiController.hideLoading();
      }, 1000);
    }
  }

  /**
   * Clear preview
   */
  clearPreview() {
    document.getElementById('page-grid').style.display = 'none';
    document.getElementById('page-grid').innerHTML = '';
    document.getElementById('empty-state').style.display = 'flex';
    document.getElementById('collation-stats').style.display = 'none';
    document.getElementById('export-controls').style.display = 'none';
    this.currentCollationResult = null;
  }
}

// Make it available globally
window.PDFCollatorApp = PDFCollatorApp;
