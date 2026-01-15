/**
 * UIController - Manages UI updates and interactions
 */

class UIController {
  constructor(fileManager, renderer) {
    this.fileManager = fileManager;
    this.renderer = renderer;
    this.currentPages = [];
    this.sortable = null;
    this.modalCurrentIndex = -1;

    // Get DOM elements
    this.elements = {
      fileList: document.getElementById('file-list'),
      fileCount: document.getElementById('file-count'),
      clearAll: document.getElementById('clear-all'),
      applyCollation: document.getElementById('apply-collation'),
      exportPdf: document.getElementById('export-pdf'),
      strategySelect: document.getElementById('strategy-select'),
      pageGrid: document.getElementById('page-grid'),
      emptyState: document.getElementById('empty-state'),
      progressContainer: document.getElementById('progress-container'),
      progressFill: document.getElementById('progress-fill'),
      progressText: document.getElementById('progress-text'),
      collationStats: document.getElementById('collation-stats'),
      exportControls: document.getElementById('export-controls'),
      modal: document.getElementById('page-modal'),
      modalCanvas: document.getElementById('modal-canvas'),
      modalDetails: document.getElementById('modal-details'),
      modalTitle: document.getElementById('modal-title')
    };
  }

  /**
   * Update file list display
   */
  updateFileList() {
    const documents = this.fileManager.getAllDocuments();
    const fileList = this.elements.fileList;

    // Clear existing
    fileList.innerHTML = '';

    if (documents.length === 0) {
      this.elements.fileCount.textContent = 'No files loaded';
      this.elements.clearAll.disabled = true;
      this.elements.applyCollation.disabled = true;
      return;
    }

    // Update count
    const totalPages = this.fileManager.getTotalPageCount();
    this.elements.fileCount.textContent = 
      `${documents.length} file${documents.length !== 1 ? 's' : ''}, ${totalPages} page${totalPages !== 1 ? 's' : ''}`;
    
    this.elements.clearAll.disabled = false;
    this.elements.applyCollation.disabled = false;

    // Render file items
    documents.forEach(doc => {
      const item = this.createFileItem(doc);
      fileList.appendChild(item);
    });
  }

  /**
   * Create file item element
   */
  createFileItem(doc) {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.dataset.id = doc.id;

    // Show detected document type if available
    const detectionBadge = doc.detectedType ? 
      `<span class="doc-type-badge doc-type-${doc.detectedType}" title="Detected: ${doc.detectedType} (${doc.detectionConfidence}% confidence)">${doc.detectedType.toUpperCase()}</span>` 
      : '';

    item.innerHTML = `
      <div class="file-icon">PDF</div>
      <div class="file-info">
        <p class="file-name" title="${PDFCollatorUtils.escapeHtml(doc.filename)}">
          ${PDFCollatorUtils.escapeHtml(PDFCollatorUtils.truncate(doc.filename, 25))}
        </p>
        <div class="file-meta">
          <span>${doc.pageCount} page${doc.pageCount !== 1 ? 's' : ''}</span>
          <span>${PDFCollatorUtils.formatFileSize(doc.fileSize)}</span>
          ${detectionBadge}
        </div>
      </div>
      <div class="file-actions">
        <button class="btn btn-text btn-sm btn-icon-only" data-action="remove" title="Remove">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // Add remove handler
    const removeBtn = item.querySelector('[data-action="remove"]');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.fileManager.removeDocument(doc.id);
    });

    return item;
  }

  /**
   * Update progress bar
   */
  updateProgress(progress, text = 'Processing...') {
    const percentage = Math.round(progress * 100);
    
    this.elements.progressContainer.style.display = 'block';
    this.elements.progressFill.style.width = `${percentage}%`;
    this.elements.progressText.textContent = `${text} ${percentage}%`;
  }

  /**
   * Hide progress bar
   */
  hideProgress() {
    this.elements.progressContainer.style.display = 'none';
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.elements.applyCollation.disabled = true;
    this.elements.exportPdf.disabled = true;
    this.elements.clearAll.disabled = true;
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.elements.applyCollation.disabled = false;
    this.elements.clearAll.disabled = false;
  }

  /**
   * Display collated pages
   */
  async displayPages(pages, documents) {
    this.currentPages = pages;

    // Hide empty state, show grid
    this.elements.emptyState.style.display = 'none';
    this.elements.pageGrid.style.display = 'grid';

    // Clear existing
    this.elements.pageGrid.innerHTML = '';

    // Render pages
    for (let i = 0; i < pages.length; i++) {
      const pageInfo = pages[i];
      const document = documents.find(d => d.id === pageInfo.documentId);
      
      if (!document) continue;

      const card = await this.createPageCard(pageInfo, document, i);
      this.elements.pageGrid.appendChild(card);
    }

    // Enable manual sorting if in manual mode
    const strategy = this.elements.strategySelect.value;
    if (strategy === 'manual') {
      this.enableDragSort();
    } else {
      this.disableDragSort();
    }
  }

  /**
   * Create page card element
   */
  async createPageCard(pageInfo, pdfDoc, displayIndex) {
    const card = document.createElement('div');
    card.className = 'page-card';
    card.dataset.pageId = pageInfo.id;
    card.dataset.index = displayIndex;

    // Render thumbnail
    const canvas = await this.renderer.renderThumbnail(pdfDoc, pageInfo);
    canvas.className = 'page-thumbnail';

    // Create info section
    const info = document.createElement('div');
    info.className = 'page-info';
    
    const pageNumber = document.createElement('p');
    pageNumber.className = 'page-number';
    pageNumber.textContent = `Page ${displayIndex + 1}`;

    const source = document.createElement('p');
    source.className = 'page-source';
    source.textContent = PDFCollatorUtils.truncate(pdfDoc.filename, 20);

    info.appendChild(pageNumber);

    // Add document type badge if available
    if (pdfDoc.detectedType && pdfDoc.detectedType !== 'unknown') {
      const typeBadge = document.createElement('span');
      typeBadge.className = `doc-type-badge doc-type-${pdfDoc.detectedType}`;
      typeBadge.textContent = pdfDoc.detectedType.toUpperCase();
      typeBadge.title = `Detected: ${pdfDoc.detectedType}`;
      info.appendChild(typeBadge);
    }

    // Add date if available
    if (pageInfo.primaryDate) {
      const date = document.createElement('p');
      date.className = 'page-date';
      date.textContent = PDFCollatorUtils.formatDate(pageInfo.primaryDate);
      info.appendChild(date);
    } else {
      const noDate = document.createElement('p');
      noDate.className = 'page-no-date';
      noDate.textContent = 'No date detected';
      info.appendChild(noDate);
    }

    info.appendChild(source);

    card.appendChild(canvas);
    card.appendChild(info);

    // Add click handler for modal
    card.addEventListener('click', () => {
      this.showPageModal(displayIndex);
    });

    return card;
  }

  /**
   * Enable drag-and-drop sorting
   */
  enableDragSort() {
    if (this.sortable) {
      this.sortable.option('disabled', false);
    } else if (window.Sortable) {
      this.sortable = new Sortable(this.elements.pageGrid, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'page-card',
        onEnd: (evt) => {
          // Update page order
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;
          
          if (oldIndex !== newIndex) {
            const [moved] = this.currentPages.splice(oldIndex, 1);
            this.currentPages.splice(newIndex, 0, moved);
            
            // Update display indices
            this.updatePageIndices();
          }
        }
      });
    }

    // Add visual indicator
    document.querySelectorAll('.page-card').forEach(card => {
      card.classList.add('manual-mode');
    });
  }

  /**
   * Disable drag-and-drop sorting
   */
  disableDragSort() {
    if (this.sortable) {
      this.sortable.option('disabled', true);
    }

    document.querySelectorAll('.page-card').forEach(card => {
      card.classList.remove('manual-mode');
    });
  }

  /**
   * Update page indices after reordering
   */
  updatePageIndices() {
    const cards = this.elements.pageGrid.querySelectorAll('.page-card');
    cards.forEach((card, index) => {
      card.dataset.index = index;
      const pageNumber = card.querySelector('.page-number');
      if (pageNumber) {
        pageNumber.textContent = `Page ${index + 1}`;
      }
    });
  }

  /**
   * Update statistics display
   */
  updateStatistics(statistics, strategy) {
    this.elements.collationStats.style.display = 'flex';

    document.getElementById('stat-total-pages').textContent = statistics.totalPages;
    document.getElementById('stat-pages-with-dates').textContent = 
      `${statistics.pagesWithDates} (${Math.round(statistics.pagesWithDates / statistics.totalPages * 100)}%)`;
    
    const strategyNames = {
      date: 'Date-based',
      filename: 'Filename',
      interleaved: 'Interleaved',
      manual: 'Manual'
    };
    document.getElementById('stat-strategy').textContent = strategyNames[strategy] || strategy;
  }

  /**
   * Show export controls
   */
  showExportControls() {
    this.elements.exportControls.style.display = 'flex';
    this.elements.exportPdf.disabled = false;
  }

  /**
   * Show page detail modal
   */
  async showPageModal(index) {
    this.modalCurrentIndex = index;
    const pageInfo = this.currentPages[index];
    const pdfDoc = this.fileManager.getDocument(pageInfo.documentId);

    if (!pdfDoc) return;

    // Render full-size page
    const canvas = await this.renderer.renderFullPage(pdfDoc, pageInfo);
    this.elements.modalCanvas.replaceWith(canvas);
    canvas.id = 'modal-canvas';
    this.elements.modalCanvas = canvas;

    // Update details
    this.elements.modalTitle.textContent = `Page ${index + 1} of ${this.currentPages.length}`;
    
    const details = `
      <div class="detail-item">
        <span class="detail-label">Source Document</span>
        <span class="detail-value">${PDFCollatorUtils.escapeHtml(pdfDoc.filename)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Original Page Number</span>
        <span class="detail-value">${pageInfo.pageNumber}</span>
      </div>
      ${pageInfo.dates.length > 0 ? `
        <div class="detail-item">
          <span class="detail-label">Detected Dates</span>
          <div class="detail-value">
            ${pageInfo.dates.map(d => 
              `<span class="date-badge">${PDFCollatorUtils.formatDate(d.value)}</span>`
            ).join('')}
          </div>
        </div>
      ` : ''}
    `;
    
    this.elements.modalDetails.innerHTML = details;

    // Show modal
    this.elements.modal.style.display = 'block';

    // Update navigation buttons
    document.getElementById('modal-prev').disabled = (index === 0);
    document.getElementById('modal-next').disabled = (index === this.currentPages.length - 1);
  }

  /**
   * Initialize modal handlers
   */
  initializeModalHandlers() {
    // Close button
    document.getElementById('modal-close').addEventListener('click', () => {
      this.elements.modal.style.display = 'none';
    });

    // Overlay click
    document.getElementById('modal-overlay').addEventListener('click', () => {
      this.elements.modal.style.display = 'none';
    });

    // Navigation
    document.getElementById('modal-prev').addEventListener('click', () => {
      if (this.modalCurrentIndex > 0) {
        this.showPageModal(this.modalCurrentIndex - 1);
      }
    });

    document.getElementById('modal-next').addEventListener('click', () => {
      if (this.modalCurrentIndex < this.currentPages.length - 1) {
        this.showPageModal(this.modalCurrentIndex + 1);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.elements.modal.style.display !== 'block') return;

      if (e.key === 'Escape') {
        this.elements.modal.style.display = 'none';
      } else if (e.key === 'ArrowLeft') {
        if (this.modalCurrentIndex > 0) {
          this.showPageModal(this.modalCurrentIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (this.modalCurrentIndex < this.currentPages.length - 1) {
          this.showPageModal(this.modalCurrentIndex + 1);
        }
      }
    });
  }

  /**
   * Get current pages (respects manual reordering)
   */
  getCurrentPages() {
    return this.currentPages;
  }
}

// Make it available globally
window.UIController = UIController;
