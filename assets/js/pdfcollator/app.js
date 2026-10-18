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
    this.orderEdited = false; // pages moved by hand since the last sort
    this.busy = false;
  }

  /**
   * Initialize the application
   */
  initialize() {
    if (!this.checkDependencies()) {
      this.uiController.notify('A required library did not load, so the collator cannot run. Check your connection and reload the page.', 'error');
      return;
    }

    this.setupCollationControls();
    this.setupExportControls();
    this.uiController.initializeModalHandlers();
    this.uiController.initializePageHandlers();

    this.uiController.onEdit = (kind) => {
      if (kind === 'move') this.orderEdited = true;
      this.refreshStrategyLabel();
    };

    this.fileManager.on('filesAdded', () => {
      this.uiController.updateFileList();
    });

    this.fileManager.on('fileRemoved', (documentId) => {
      this.renderer.clearDocumentCache(documentId);
      this.uiController.removeDocumentPages(documentId);
      this.uiController.updateFileList();

      if (this.fileManager.getAllDocuments().length === 0) {
        this.clearPreview();
      }
    });

    this.fileManager.on('filesCleared', () => {
      this.uiController.updateFileList();
      this.renderer.clearCache();
      this.clearPreview();
    });

    this.resetFilename();
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
   * Handle uploaded files: load, then sort straight away
   */
  async handleFiles(files) {
    if (this.busy) {
      this.uiController.notify('Still working on the previous files. Add these again in a moment.', 'warning', 5000);
      return;
    }

    this.setBusy(true);
    this.uiController.updateProgress(0, 'Loading PDFs');

    let added = [];
    try {
      const results = await this.fileManager.loadFiles(files, (progress, label) => {
        this.uiController.updateProgress(progress * 0.4, label);
      });

      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        this.uiController.notify([
          errors.length === 1 ? '1 file was skipped' : `${errors.length} files were skipped`,
          ...errors.map(e => `${e.filename}: ${e.error}`)
        ], 'error');
      }

      added = results.filter(r => r.success).map(r => r.document);
    } catch (error) {
      console.error('Error handling files:', error);
      this.uiController.notify(`Something went wrong while reading the files: ${error.message}`, 'error');
    }

    if (added.length > 0) {
      await this.organizePages(added);
    }

    this.setBusy(false);
    this.uiController.hideProgress();
  }

  /**
   * After files are added: sort everything with the chosen strategy, unless
   * the user has already arranged pages by hand, in which case the new pages
   * go on the end so that work isn't thrown away.
   */
  async organizePages(newDocuments) {
    const strategy = document.getElementById('strategy-select').value;
    const hasLayout = this.uiController.getCurrentPages().length > 0;

    if (hasLayout && (this.orderEdited || strategy === 'manual')) {
      const newPages = await this.analyzeAll(newDocuments, 0.4, 0.9);
      this.uiController.setPages([...this.uiController.getCurrentPages(), ...newPages]);
      this.uiController.updateFileList();
      this.uiController.notify(
        `Added ${newPages.length} page${newPages.length !== 1 ? 's' : ''} at the end so your manual order is kept. Use "Re-sort" to apply the strategy to everything.`,
        'info', 8000
      );
      await this.waitForThumbnails(0.9);
      return;
    }

    await this.applyCollation({ progressStart: 0.4, keepBusy: true });
  }

  /**
   * Analyze documents (text + dates), returning their pages
   */
  async analyzeAll(documents, from = 0, to = 0.5) {
    return this.analyzer.getAllPages(documents, (progress) => {
      this.uiController.updateProgress(from + progress * (to - from), 'Reading page text');
    });
  }

  /**
   * Set up collation controls
   */
  setupCollationControls() {
    const applyBtn = document.getElementById('apply-collation');
    const strategySelect = document.getElementById('strategy-select');
    const clearBtn = document.getElementById('clear-all');

    applyBtn.addEventListener('click', async () => {
      await this.applyCollation();
    });

    // Strategy change re-sorts whatever is loaded
    strategySelect.addEventListener('change', () => {
      if (this.fileManager.getAllDocuments().length > 0 && !this.busy) {
        this.applyCollation();
      }
    });

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
    document.getElementById('export-controls').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.exportPDF();
    });
  }

  /**
   * Apply collation to all loaded pages (except ones the user removed)
   */
  async applyCollation({ progressStart = 0, keepBusy = false } = {}) {
    const documents = this.fileManager.getAllDocuments();

    if (documents.length === 0) {
      this.uiController.notify('Add some PDF files first.', 'warning', 5000);
      return;
    }

    if (!keepBusy) this.setBusy(true);

    try {
      const span = 1 - progressStart;
      const allPages = await this.analyzeAll(documents, progressStart, progressStart + span * 0.5);

      const strategy = document.getElementById('strategy-select').value;
      this.uiController.updateProgress(progressStart + span * 0.55, 'Sorting pages');

      const removedIds = this.uiController.getRemovedIds();
      const current = this.uiController.getCurrentPages();
      let basePages = allPages.filter(p => !removedIds.has(p.id));

      // Manual keeps the existing arrangement and appends anything new
      if (strategy === 'manual' && current.length > 0) {
        const shown = new Set(current.map(p => p.id));
        basePages = [...current, ...basePages.filter(p => !shown.has(p.id))];
      }

      this.currentCollationResult = this.collator.collate(basePages, documents, strategy);

      const ordered = this.currentCollationResult.orderedPages.filter(p => !removedIds.has(p.id));
      this.uiController.setPages(ordered);
      this.orderEdited = false;

      this.uiController.updateFileList(); // shows detected type badges
      this.uiController.updateStatistics(
        this.currentCollationResult.statistics,
        this.collator.getStrategyName(strategy)
      );
      this.uiController.showExportControls();

      await this.waitForThumbnails(progressStart + span * 0.6);
      this.uiController.announce(`Sorted ${ordered.length} pages using ${this.collator.getStrategyName(strategy)}`);

    } catch (error) {
      console.error('Error during collation:', error);
      this.uiController.notify(`Could not sort the pages: ${error.message}`, 'error');
    } finally {
      if (!keepBusy) {
        this.setBusy(false);
        this.uiController.hideProgress();
      }
    }
  }

  /**
   * Show progress while the first thumbnails draw
   */
  async waitForThumbnails(from) {
    const total = this.uiController.getCurrentPages().length;
    if (total === 0) return;
    for (let i = 0; i < 600; i++) {
      const pending = this.uiController.pendingThumbnails();
      this.uiController.updateProgress(from + (1 - from) * (1 - pending / total), 'Drawing previews');
      if (pending === 0) return;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  refreshStrategyLabel() {
    const strategy = document.getElementById('strategy-select').value;
    let label = this.collator.getStrategyName(strategy);
    if (this.orderEdited && strategy !== 'manual') label += ' + manual changes';
    const el = document.getElementById('stat-strategy');
    if (el) el.textContent = label;
  }

  /**
   * Export collated PDF
   */
  async exportPDF() {
    const orderedPages = this.uiController.getCurrentPages().slice();
    if (orderedPages.length === 0) {
      this.uiController.notify('There are no pages to save. Add files, or restore removed pages.', 'warning', 6000);
      return;
    }

    this.setBusy(true);
    this.uiController.updateProgress(0, 'Building PDF');

    try {
      const filename = document.getElementById('output-filename').value;
      const result = await this.exporter.exportPDF(orderedPages, filename, (progress) => {
        this.uiController.updateProgress(progress * 0.95, 'Building PDF');
      });

      if (!result.success) throw new Error(result.error);

      this.uiController.updateProgress(1, 'Saved');
      this.uiController.notify(
        `Saved ${orderedPages.length} page${orderedPages.length !== 1 ? 's' : ''} as ${result.filename} (${PDFCollatorUtils.formatFileSize(result.size)}). Check your downloads.`,
        'success', 10000
      );
    } catch (error) {
      this.uiController.notify(error.message, 'error');
    } finally {
      this.setBusy(false);
      setTimeout(() => this.uiController.hideProgress(), 600);
    }
  }

  setBusy(busy) {
    this.busy = busy;
    document.getElementById('pdf-collator-app').setAttribute('aria-busy', busy ? 'true' : 'false');
    if (busy) this.uiController.showLoading(); else this.uiController.hideLoading();
  }

  resetFilename() {
    const input = document.getElementById('output-filename');
    if (input) input.value = `collated-${PDFCollatorUtils.localDateStamp()}`;
  }

  /**
   * Clear preview
   */
  clearPreview() {
    this.uiController.reset();
    document.getElementById('collation-stats').style.display = 'none';
    document.getElementById('export-controls').style.display = 'none';
    this.currentCollationResult = null;
    this.orderEdited = false;
  }
}

// Make it available globally
window.PDFCollatorApp = PDFCollatorApp;
