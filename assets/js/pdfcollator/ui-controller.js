/**
 * UIController - Manages UI updates and interactions
 *
 * Owns the editable page list: order, per-page rotation, removed pages,
 * selection and undo history. The app decides what the order starts as
 * (via a collation strategy); everything after that happens here.
 */

const ICONS = {
  rotateLeft: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2v6h6"></path><path d="M3.5 13a9 9 0 1 0 2.6-7.4L3 8"></path></svg>',
  rotateRight: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 2v6h-6"></path><path d="M20.5 13a9 9 0 1 1-2.6-7.4L21 8"></path></svg>',
  remove: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
};

class UIController {
  constructor(fileManager, renderer) {
    this.fileManager = fileManager;
    this.renderer = renderer;

    // Editable page state
    this.currentPages = [];   // pages in output order
    this.removedPages = [];   // pages taken out (restorable)
    this.selected = new Set(); // page ids
    this.history = [];        // undo snapshots
    this.maxHistory = 100;
    this.lastClickedIndex = null;

    this.cards = new Map();   // page id -> <li>
    this.renderToken = 0;
    this.sortable = null;
    this.modalCurrentIndex = -1;
    this.onEdit = null;       // set by app: called with the kind of edit

    // Get DOM elements
    this.elements = {
      fileList: document.getElementById('file-list'),
      fileCount: document.getElementById('file-count'),
      clearAll: document.getElementById('clear-all'),
      applyCollation: document.getElementById('apply-collation'),
      exportPdf: document.getElementById('export-pdf'),
      outputFilename: document.getElementById('output-filename'),
      strategySelect: document.getElementById('strategy-select'),
      pageGrid: document.getElementById('page-grid'),
      pageToolbar: document.getElementById('page-toolbar'),
      selectionCount: document.getElementById('selection-count'),
      rangeInput: document.getElementById('range-input'),
      moveToInput: document.getElementById('move-to-input'),
      undoBtn: document.getElementById('undo-btn'),
      restoreBtn: document.getElementById('restore-removed'),
      emptyState: document.getElementById('empty-state'),
      progressContainer: document.getElementById('progress-container'),
      progressFill: document.getElementById('progress-fill'),
      progressText: document.getElementById('progress-text'),
      collationStats: document.getElementById('collation-stats'),
      exportControls: document.getElementById('export-controls'),
      notices: document.getElementById('app-notices'),
      srStatus: document.getElementById('sr-status'),
      modal: document.getElementById('page-modal'),
      modalCanvas: document.getElementById('modal-canvas'),
      modalDetails: document.getElementById('modal-details'),
      modalTitle: document.getElementById('modal-title')
    };
  }

  /* ==========================================
     Notices and progress
     ========================================== */

  /**
   * Show a dismissible message above the workspace.
   * type: 'info' | 'success' | 'warning' | 'error'
   */
  notify(message, type = 'info', timeout = 0) {
    const notice = document.createElement('div');
    notice.className = `notice notice-${type}`;
    notice.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const text = document.createElement('div');
    text.className = 'notice-text';
    if (Array.isArray(message)) {
      const title = document.createElement('strong');
      title.textContent = message[0];
      text.appendChild(title);
      const list = document.createElement('ul');
      message.slice(1).forEach(line => {
        const li = document.createElement('li');
        li.textContent = line;
        list.appendChild(li);
      });
      text.appendChild(list);
    } else {
      text.textContent = message;
    }

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'notice-close';
    close.setAttribute('aria-label', 'Dismiss message');
    close.innerHTML = ICONS.remove;
    close.addEventListener('click', () => notice.remove());

    notice.appendChild(text);
    notice.appendChild(close);
    this.elements.notices.appendChild(notice);

    // Keep the list short
    while (this.elements.notices.children.length > 4) {
      this.elements.notices.firstElementChild.remove();
    }

    if (timeout > 0) {
      setTimeout(() => notice.remove(), timeout);
    }
    return notice;
  }

  clearNotices() {
    this.elements.notices.innerHTML = '';
  }

  /**
   * Screen-reader announcement
   */
  announce(message) {
    const el = this.elements.srStatus;
    el.textContent = '';
    // Re-setting on the next frame makes repeated messages announce again
    requestAnimationFrame(() => { el.textContent = message; });
  }

  /**
   * Update progress bar
   */
  updateProgress(progress, text = 'Processing') {
    const percentage = Math.max(0, Math.min(100, Math.round(progress * 100)));

    this.elements.progressContainer.style.display = 'block';
    this.elements.progressFill.style.width = `${percentage}%`;
    this.elements.progressText.textContent = `${text}… ${percentage}%`;
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
    this.busy = true;
    this.elements.applyCollation.disabled = true;
    this.elements.exportPdf.disabled = true;
    this.elements.clearAll.disabled = true;
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.busy = false;
    const hasFiles = this.fileManager.getAllDocuments().length > 0;
    this.elements.applyCollation.disabled = !hasFiles;
    this.elements.clearAll.disabled = !hasFiles;
    this.elements.exportPdf.disabled = this.currentPages.length === 0;
  }

  /* ==========================================
     File list
     ========================================== */

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

    this.elements.clearAll.disabled = !!this.busy;
    this.elements.applyCollation.disabled = !!this.busy;

    // Render file items
    documents.forEach(doc => {
      fileList.appendChild(this.createFileItem(doc));
    });
  }

  /**
   * Create file item element
   */
  createFileItem(doc) {
    const item = document.createElement('li');
    item.className = `file-item src-color-${doc.colorIndex}`;
    item.dataset.id = doc.id;

    const escape = PDFCollatorUtils.escapeHtml;

    // Show detected document type if available
    const detectionBadge = doc.detectedType ?
      `<span class="doc-type-badge doc-type-${doc.detectedType}" title="Detected as ${escape(doc.detectedType)} (score ${doc.detectionConfidence})">${escape(doc.detectedType)}</span>`
      : '';

    item.innerHTML = `
      <span class="src-swatch" aria-hidden="true"></span>
      <div class="file-info">
        <p class="file-name" title="${escape(doc.filename)}">${escape(doc.filename)}</p>
        <div class="file-meta">
          <span>${doc.pageCount} page${doc.pageCount !== 1 ? 's' : ''}</span>
          <span>${PDFCollatorUtils.formatFileSize(doc.fileSize)}</span>
          ${detectionBadge}
        </div>
      </div>
      <button type="button" class="btn btn-text btn-icon-only" data-action="remove">
        ${ICONS.remove}
      </button>
    `;

    const removeBtn = item.querySelector('[data-action="remove"]');
    removeBtn.setAttribute('aria-label', `Remove ${doc.filename}`);
    removeBtn.title = 'Remove file';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.fileManager.removeDocument(doc.id);
    });

    return item;
  }

  /* ==========================================
     Page list state
     ========================================== */

  /**
   * Replace the page order (after collation). Recorded for undo when there
   * was already an order to go back to.
   */
  setPages(pages, { record = true, removed = null } = {}) {
    if (record && this.currentPages.length > 0) this.pushHistory();
    this.currentPages = pages.slice();
    if (removed) this.removedPages = removed.slice();
    this.pruneSelection();
    this.renderGrid();
  }

  /**
   * Drop every page from a document (when its file is removed)
   */
  removeDocumentPages(documentId) {
    this.currentPages = this.currentPages.filter(p => p.documentId !== documentId);
    this.removedPages = this.removedPages.filter(p => p.documentId !== documentId);
    // Snapshots may reference the removed file's pages
    this.history = [];
    this.pruneSelection();
    this.renderGrid();
  }

  reset() {
    this.currentPages = [];
    this.removedPages = [];
    this.selected.clear();
    this.history = [];
    this.cards.clear();
    this.renderToken++;
    this.elements.pageGrid.innerHTML = '';
    this.renderGrid();
  }

  getRemovedIds() {
    return new Set(this.removedPages.map(p => p.id));
  }

  pruneSelection() {
    const ids = new Set(this.currentPages.map(p => p.id));
    for (const id of Array.from(this.selected)) {
      if (!ids.has(id)) this.selected.delete(id);
    }
  }

  pushHistory() {
    const rotations = new Map();
    [...this.currentPages, ...this.removedPages].forEach(p => rotations.set(p, p.rotation || 0));
    this.history.push({
      pages: this.currentPages.slice(),
      removed: this.removedPages.slice(),
      rotations
    });
    if (this.history.length > this.maxHistory) this.history.shift();
  }

  undo() {
    const snapshot = this.history.pop();
    if (!snapshot) {
      this.announce('Nothing to undo');
      return;
    }
    this.currentPages = snapshot.pages;
    this.removedPages = snapshot.removed;
    snapshot.rotations.forEach((rotation, page) => { page.rotation = rotation; });
    this.pruneSelection();
    this.afterEdit('Undone', 'undo');
  }

  afterEdit(message, kind) {
    this.renderGrid();
    if (message) this.announce(message);
    if (this.onEdit) this.onEdit(kind);
  }

  /**
   * Indices the toolbar/keyboard action should apply to: the selection if
   * the focused page is part of it (or no page is given), else that page.
   */
  targetIndices(index = null) {
    const selectedIdx = this.selectedIndices();
    if (index === null) return selectedIdx;
    const page = this.currentPages[index];
    if (page && this.selected.has(page.id) && selectedIdx.length > 0) return selectedIdx;
    return [index];
  }

  selectedIndices() {
    const result = [];
    this.currentPages.forEach((p, i) => { if (this.selected.has(p.id)) result.push(i); });
    return result;
  }

  /* ==========================================
     Edits
     ========================================== */

  /**
   * Move the pages at `indices` so the first of them lands at `target`
   * (0-based position in the final list). Keeps their relative order.
   */
  movePages(indices, target) {
    if (indices.length === 0) return;
    const moving = indices.map(i => this.currentPages[i]);
    const rest = this.currentPages.filter((_, i) => !indices.includes(i));
    const clamped = Math.max(0, Math.min(rest.length, target));
    const next = [...rest.slice(0, clamped), ...moving, ...rest.slice(clamped)];

    if (next.every((p, i) => p === this.currentPages[i])) return;

    this.pushHistory();
    this.currentPages = next;
    const label = moving.length === 1 ? 'Page' : `${moving.length} pages`;
    this.afterEdit(`${label} moved to position ${clamped + 1} of ${next.length}`, 'move');
  }

  /**
   * Move a single page (or the selection containing it) by delta places
   */
  moveBy(index, delta) {
    const indices = this.targetIndices(index);
    // Target is a position among the pages that are not moving, so +1 lands
    // the block just after the page that followed it
    this.movePages(indices, indices[0] + delta);
  }

  rotatePages(indices, delta) {
    if (indices.length === 0) return;
    this.pushHistory();
    indices.forEach(i => {
      const page = this.currentPages[i];
      page.rotation = ((((page.rotation || 0) + delta) % 360) + 360) % 360;
    });
    const label = indices.length === 1 ? `Page ${indices[0] + 1}` : `${indices.length} pages`;
    this.afterEdit(`${label} rotated ${delta > 0 ? 'right' : 'left'}`, 'rotate');
  }

  removePages(indices) {
    if (indices.length === 0) return;
    this.pushHistory();
    const removing = new Set(indices.map(i => this.currentPages[i]));
    this.removedPages = [...this.removedPages, ...removing];
    this.currentPages = this.currentPages.filter(p => !removing.has(p));
    removing.forEach(p => this.selected.delete(p.id));
    const label = removing.size === 1 ? '1 page removed' : `${removing.size} pages removed`;
    this.afterEdit(`${label}. Press Undo to bring ${removing.size === 1 ? 'it' : 'them'} back.`, 'remove');
  }

  /**
   * Put removed pages back at the end
   */
  restoreRemoved() {
    if (this.removedPages.length === 0) return;
    this.pushHistory();
    const count = this.removedPages.length;
    this.currentPages = [...this.currentPages, ...this.removedPages];
    this.removedPages = [];
    this.afterEdit(`${count} page${count !== 1 ? 's' : ''} restored at the end`, 'restore');
  }

  /* ==========================================
     Selection
     ========================================== */

  setSelected(index, on) {
    const page = this.currentPages[index];
    if (!page) return;
    if (on) this.selected.add(page.id); else this.selected.delete(page.id);
  }

  toggleSelect(index, extendRange = false) {
    const page = this.currentPages[index];
    if (!page) return;
    const on = !this.selected.has(page.id);

    if (extendRange && this.lastClickedIndex !== null) {
      const [a, b] = [this.lastClickedIndex, index].sort((x, y) => x - y);
      for (let i = a; i <= b; i++) this.setSelected(i, on);
    } else {
      this.setSelected(index, on);
    }
    this.lastClickedIndex = index;
    this.refreshSelection();
  }

  selectIndices(indices, { add = false } = {}) {
    if (!add) this.selected.clear();
    indices.forEach(i => this.setSelected(i, true));
    this.refreshSelection();
    this.announce(`${this.selected.size} page${this.selected.size !== 1 ? 's' : ''} selected`);
  }

  selectRangeText(text) {
    const indices = PDFCollatorUtils.parsePageRange(text, this.currentPages.length);
    if (indices === null) {
      this.notify(`"${text}" is not a page list. Use numbers and ranges, e.g. 1-3, 7, 10-.`, 'warning', 6000);
      return;
    }
    if (indices.length === 0) {
      this.notify(`No pages match "${text}" (there are ${this.currentPages.length}).`, 'warning', 6000);
      return;
    }
    this.selectIndices(indices);
  }

  clearSelection() {
    if (this.selected.size === 0) return;
    this.selected.clear();
    this.refreshSelection();
    this.announce('Selection cleared');
  }

  refreshSelection() {
    this.currentPages.forEach((page, i) => {
      const card = this.cards.get(page.id);
      if (card) this.updateCard(card, page, i);
    });
    this.updateToolbar();
  }

  /* ==========================================
     Grid rendering
     ========================================== */

  /**
   * Bring the grid in line with currentPages, reusing cards so thumbnails
   * don't have to be redrawn.
   */
  renderGrid() {
    const grid = this.elements.pageGrid;
    const hasPages = this.currentPages.length > 0;
    const hasAnything = hasPages || this.removedPages.length > 0;

    this.elements.emptyState.style.display = hasAnything ? 'none' : 'flex';
    grid.style.display = hasPages ? 'grid' : 'none';
    this.elements.pageToolbar.style.display = hasAnything ? 'flex' : 'none';

    const focusedId = this.focusedPageId();
    const liveIds = new Set(this.currentPages.map(p => p.id));

    // Drop cards for pages no longer shown
    for (const [id, card] of this.cards) {
      if (!liveIds.has(id)) {
        card.remove();
        if (!this.isKnownPage(id)) this.cards.delete(id);
      }
    }

    // Insert / reorder
    this.currentPages.forEach((page, i) => {
      let card = this.cards.get(page.id);
      if (!card) {
        const doc = this.fileManager.getDocument(page.documentId);
        if (!doc) return;
        card = this.createPageCard(page, doc);
        this.cards.set(page.id, card);
      }
      if (grid.children[i] !== card) {
        grid.insertBefore(card, grid.children[i] || null);
      }
      this.updateCard(card, page, i);
    });

    // Restore focus lost by moving the focused card
    if (focusedId && liveIds.has(focusedId)) {
      const card = this.cards.get(focusedId);
      const btn = card && card.querySelector('.page-thumb-btn');
      if (btn && document.activeElement !== btn && !this.isModalOpen()) btn.focus({ preventScroll: false });
    }

    this.updateToolbar();
    this.updateLiveStats();
    this.enableDragSort();
    this.renderThumbnails();
  }

  isKnownPage(id) {
    return this.removedPages.some(p => p.id === id) ||
      this.history.some(h => h.pages.some(p => p.id === id));
  }

  focusedPageId() {
    const card = document.activeElement && document.activeElement.closest &&
      document.activeElement.closest('.page-card');
    return card ? card.dataset.pageId : null;
  }

  /**
   * Create page card element
   */
  createPageCard(pageInfo, pdfDoc) {
    const card = document.createElement('li');
    card.className = `page-card src-color-${pdfDoc.colorIndex}`;
    card.dataset.pageId = pageInfo.id;

    const escape = PDFCollatorUtils.escapeHtml;
    const typeBadge = pdfDoc.detectedType && pdfDoc.detectedType !== 'unknown'
      ? `<span class="doc-type-badge doc-type-${pdfDoc.detectedType}">${escape(pdfDoc.detectedType)}</span>`
      : '';
    const dateText = pageInfo.primaryDate
      ? `<span class="page-date">${escape(PDFCollatorUtils.formatDate(pageInfo.primaryDate))}</span>`
      : '<span class="page-no-date">No date</span>';

    card.innerHTML = `
      <div class="page-card-top">
        <label class="page-select">
          <input type="checkbox" class="page-checkbox">
          <span class="page-number"></span>
        </label>
        <div class="page-actions">
          <button type="button" class="page-action" data-action="rotate-left" tabindex="-1" title="Rotate left (Shift+R)">${ICONS.rotateLeft}</button>
          <button type="button" class="page-action" data-action="rotate-right" tabindex="-1" title="Rotate right (R)">${ICONS.rotateRight}</button>
          <button type="button" class="page-action page-action-remove" data-action="remove" tabindex="-1" title="Remove page (Delete)">${ICONS.remove}</button>
        </div>
      </div>
      <button type="button" class="page-thumb-btn" data-action="preview" aria-describedby="shortcut-help">
        <span class="page-thumb"><span class="page-thumb-placeholder" aria-hidden="true"></span></span>
      </button>
      <div class="page-info">
        <p class="page-source" title="${escape(pdfDoc.filename)}, page ${pageInfo.pageNumber}">
          <span class="src-swatch" aria-hidden="true"></span>
          <span class="page-source-name">${escape(pdfDoc.filename)}</span>
          <span class="page-source-num">p.${pageInfo.pageNumber}</span>
        </p>
        <p class="page-meta">${typeBadge}${dateText}</p>
      </div>
    `;

    card.querySelectorAll('.page-action').forEach(btn => {
      btn.setAttribute('aria-label', btn.title.replace(/ \(.*\)$/, ''));
    });

    return card;
  }

  /**
   * Refresh the parts of a card that depend on its position/state
   */
  updateCard(card, page, index) {
    const total = this.currentPages.length;
    const doc = this.fileManager.getDocument(page.documentId);
    const selected = this.selected.has(page.id);

    card.dataset.index = index;
    card.classList.toggle('is-selected', selected);
    card.querySelector('.page-number').textContent = index + 1;

    const checkbox = card.querySelector('.page-checkbox');
    checkbox.checked = selected;
    checkbox.setAttribute('aria-label', `Select page ${index + 1}`);

    const rotation = page.rotation || 0;
    const parts = [
      `Page ${index + 1} of ${total}`,
      doc ? `${doc.filename}, original page ${page.pageNumber}` : '',
      page.primaryDate ? PDFCollatorUtils.formatDate(page.primaryDate) : '',
      rotation ? `rotated ${rotation} degrees` : '',
      selected ? 'selected' : ''
    ].filter(Boolean);
    card.querySelector('.page-thumb-btn').setAttribute('aria-label', parts.join(', '));
  }

  /**
   * Draw thumbnails that are missing or out of date, one at a time, in the
   * order the pages appear. A newer call cancels an older one.
   */
  async renderThumbnails() {
    const token = ++this.renderToken;
    for (const page of this.currentPages.slice()) {
      if (token !== this.renderToken) return;
      const card = this.cards.get(page.id);
      if (!card) continue;
      const key = String(page.rotation || 0);
      if (card.dataset.rendered === key) continue;

      const doc = this.fileManager.getDocument(page.documentId);
      if (!doc) continue;
      const canvas = await this.renderer.renderThumbnail(doc, page);

      // Only use the drawing if the page wasn't rotated again meanwhile
      if (String(page.rotation || 0) === key) {
        canvas.className = 'page-thumbnail';
        canvas.setAttribute('aria-hidden', 'true');
        const holder = card.querySelector('.page-thumb');
        holder.innerHTML = '';
        holder.appendChild(canvas);
        card.dataset.rendered = key;
      }
      if (token !== this.renderToken) return;
    }
  }

  /**
   * Total thumbnails rendered vs needed (for progress)
   */
  pendingThumbnails() {
    return this.currentPages.filter(p => {
      const card = this.cards.get(p.id);
      return !card || card.dataset.rendered !== String(p.rotation || 0);
    }).length;
  }

  updateToolbar() {
    const count = this.selected.size;
    const total = this.currentPages.length;
    this.elements.selectionCount.textContent = count === 0
      ? 'No pages selected'
      : `${count} of ${total} selected`;

    document.querySelectorAll('[data-needs-selection]').forEach(btn => {
      btn.disabled = count === 0;
    });
    this.elements.moveToInput.max = Math.max(1, total);

    this.elements.undoBtn.disabled = this.history.length === 0;
    const removed = this.removedPages.length;
    this.elements.restoreBtn.disabled = removed === 0;
    this.elements.restoreBtn.textContent = removed > 0 ? `Restore removed (${removed})` : 'Restore removed';

    if (!this.busy) this.elements.exportPdf.disabled = total === 0;
  }

  updateLiveStats() {
    const totalEl = document.getElementById('stat-total-pages');
    const removedEl = document.getElementById('stat-removed');
    if (totalEl) totalEl.textContent = this.currentPages.length;
    if (removedEl) removedEl.textContent = this.removedPages.length;
    const datedEl = document.getElementById('stat-pages-with-dates');
    if (datedEl && this.currentPages.length > 0) {
      const dated = this.currentPages.filter(p => p.primaryDate).length;
      datedEl.textContent = `${dated} (${Math.round(dated / this.currentPages.length * 100)}%)`;
    }
  }

  /* ==========================================
     Interaction wiring
     ========================================== */

  /**
   * Hook up grid clicks, keyboard shortcuts and the page toolbar
   */
  initializePageHandlers() {
    const grid = this.elements.pageGrid;

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.page-card');
      if (!card) return;
      const index = parseInt(card.dataset.index, 10);

      if (e.target.classList.contains('page-checkbox')) {
        // The box has already flipped; toggleSelect re-applies the state
        // from our selection (and extends it on Shift+click)
        this.toggleSelect(index, e.shiftKey);
        return;
      }

      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;
      const action = actionEl.dataset.action;

      if (action === 'preview') {
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
          this.toggleSelect(index, e.shiftKey);
        } else {
          this.showPageModal(index);
        }
      } else if (action === 'rotate-left') {
        this.rotatePages(this.targetIndices(index), -90);
      } else if (action === 'rotate-right') {
        this.rotatePages(this.targetIndices(index), 90);
      } else if (action === 'remove') {
        this.removePages(this.targetIndices(index));
      }
    });

    grid.addEventListener('keydown', (e) => this.handleGridKey(e));

    // Toolbar
    const on = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    on('select-all', () => this.selectIndices(this.currentPages.map((_, i) => i)));
    on('select-none', () => this.clearSelection());
    on('undo-btn', () => this.undo());
    on('restore-removed', () => this.restoreRemoved());
    on('sel-rotate-left', () => this.rotatePages(this.selectedIndices(), -90));
    on('sel-rotate-right', () => this.rotatePages(this.selectedIndices(), 90));
    on('sel-remove', () => this.removePages(this.selectedIndices()));
    on('sel-move-start', () => this.movePages(this.selectedIndices(), 0));
    on('sel-move-end', () => this.movePages(this.selectedIndices(), this.currentPages.length));
    on('sel-move-to', () => this.moveSelectionTo());

    document.getElementById('range-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.selectRangeText(this.elements.rangeInput.value);
    });
    this.elements.moveToInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.moveSelectionTo();
      }
    });

    // Global undo
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        if (this.currentPages.length === 0 && this.history.length === 0) return;
        e.preventDefault();
        this.undo();
      }
    });
  }

  moveSelectionTo() {
    const indices = this.selectedIndices();
    const position = parseInt(this.elements.moveToInput.value, 10);
    if (indices.length === 0) return;
    if (isNaN(position) || position < 1) {
      this.notify('Enter the position to move the selected pages to (1 is the first page).', 'warning', 5000);
      this.elements.moveToInput.focus();
      return;
    }
    // Position counts pages in the final list
    this.movePages(indices, Math.min(position, this.currentPages.length) - 1);
  }

  /**
   * Keyboard control for page cards
   *   Arrows: move focus · Alt+Arrows: move page · Alt+Home/End: to start/end
   *   R / Shift+R: rotate · Delete: remove · X: select · Esc: clear selection
   */
  handleGridKey(e) {
    const card = e.target.closest('.page-card');
    if (!card || e.target.classList.contains('page-checkbox') && e.key === ' ') return;
    const index = parseInt(card.dataset.index, 10);
    const total = this.currentPages.length;
    const columns = this.gridColumns();
    let handled = true;

    const focusIndex = (i) => {
      const page = this.currentPages[Math.max(0, Math.min(total - 1, i))];
      const target = page && this.cards.get(page.id);
      if (target) target.querySelector('.page-thumb-btn').focus();
    };

    const key = e.key;
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      if (key === 'ArrowLeft') this.moveBy(index, -1);
      else if (key === 'ArrowRight') this.moveBy(index, 1);
      else if (key === 'ArrowUp') this.moveBy(index, -columns);
      else if (key === 'ArrowDown') this.moveBy(index, columns);
      else if (key === 'Home') this.movePages(this.targetIndices(index), 0);
      else if (key === 'End') this.movePages(this.targetIndices(index), total);
      else handled = false;
    } else if (e.ctrlKey || e.metaKey) {
      if (key.toLowerCase() === 'a') this.selectIndices(this.currentPages.map((_, i) => i));
      else handled = false;
    } else if (key === 'ArrowLeft') focusIndex(index - 1);
    else if (key === 'ArrowRight') focusIndex(index + 1);
    else if (key === 'ArrowUp') focusIndex(index - columns);
    else if (key === 'ArrowDown') focusIndex(index + columns);
    else if (key === 'Home') focusIndex(0);
    else if (key === 'End') focusIndex(total - 1);
    else if (key === 'r' || key === 'R') this.rotatePages(this.targetIndices(index), e.shiftKey ? -90 : 90);
    else if (key === 'Delete' || key === 'Backspace') {
      const indices = this.targetIndices(index);
      this.removePages(indices);
      focusIndex(Math.min(indices[0], this.currentPages.length - 1));
    } else if (key === 'x' || key === 'X') this.toggleSelect(index, e.shiftKey);
    else if (key === 'Escape') this.clearSelection();
    else handled = false;

    if (handled) e.preventDefault();
  }

  gridColumns() {
    const cards = this.elements.pageGrid.children;
    if (cards.length < 2) return 1;
    const top = cards[0].offsetTop;
    let n = 0;
    while (n < cards.length && cards[n].offsetTop === top) n++;
    return Math.max(1, n);
  }

  /**
   * Drag-and-drop reordering (always on; long-press on touch screens so
   * the page can still scroll)
   */
  enableDragSort() {
    if (this.sortable || !window.Sortable) return;
    this.sortable = new Sortable(this.elements.pageGrid, {
      animation: 150,
      delay: 200,
      delayOnTouchOnly: true,
      filter: '.page-checkbox, .page-action',
      preventOnFilter: false,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex === newIndex || oldIndex === undefined) return;
        // Sortable already moved the element; record and update our order
        this.pushHistory();
        const next = this.currentPages.slice();
        const [moved] = next.splice(oldIndex, 1);
        next.splice(newIndex, 0, moved);
        this.currentPages = next;
        this.afterEdit(`Page moved to position ${newIndex + 1} of ${next.length}`, 'move');
      }
    });
  }

  /* ==========================================
     Statistics and export
     ========================================== */

  /**
   * Update statistics display
   */
  updateStatistics(statistics, strategyLabel) {
    this.elements.collationStats.style.display = 'flex';
    document.getElementById('stat-strategy').textContent = strategyLabel;
    this.updateLiveStats();
  }

  /**
   * Show export controls
   */
  showExportControls() {
    this.elements.exportControls.style.display = 'flex';
    this.elements.exportPdf.disabled = this.currentPages.length === 0;
  }

  /* ==========================================
     Preview modal
     ========================================== */

  isModalOpen() {
    return this.elements.modal.style.display === 'block';
  }

  /**
   * Show page detail modal
   */
  async showPageModal(index) {
    if (index < 0 || index >= this.currentPages.length) return;
    const pageInfo = this.currentPages[index];
    const pdfDoc = this.fileManager.getDocument(pageInfo.documentId);
    if (!pdfDoc) return;

    this.modalCurrentIndex = index;
    if (!this.isModalOpen()) {
      this._modalTrigger = document.activeElement;
      this.elements.modal.style.display = 'block';
      document.body.classList.add('pdfc-modal-open');
      document.getElementById('modal-close').focus();
    }

    // Update details first so the dialog responds immediately
    this.elements.modalTitle.textContent = `Page ${index + 1} of ${this.currentPages.length}`;
    const escape = PDFCollatorUtils.escapeHtml;
    const typeLabel = pdfDoc.detectedType && pdfDoc.detectedType !== 'unknown' ? pdfDoc.detectedType : null;

    this.elements.modalDetails.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">Source</span>
        <span class="detail-value src-color-${pdfDoc.colorIndex}"><span class="src-swatch" aria-hidden="true"></span> ${escape(pdfDoc.filename)}, page ${pageInfo.pageNumber} of ${pdfDoc.pageCount}</span>
      </div>
      ${typeLabel ? `
      <div class="detail-item">
        <span class="detail-label">Detected type</span>
        <span class="detail-value"><span class="doc-type-badge doc-type-${typeLabel}">${escape(typeLabel)}</span></span>
      </div>` : ''}
      ${pageInfo.rotation ? `
      <div class="detail-item">
        <span class="detail-label">Rotation</span>
        <span class="detail-value">${pageInfo.rotation}° clockwise</span>
      </div>` : ''}
      ${pageInfo.dates.length > 0 ? `
        <div class="detail-item">
          <span class="detail-label">Detected dates</span>
          <div class="detail-value">
            ${pageInfo.dates.map(d =>
              `<span class="date-badge">${escape(PDFCollatorUtils.formatDate(d.value))}</span>`
            ).join('')}
          </div>
        </div>
      ` : `
        <div class="detail-item">
          <span class="detail-label">Detected dates</span>
          <span class="detail-value">None</span>
        </div>`}
    `;

    document.getElementById('modal-prev').disabled = (index === 0);
    document.getElementById('modal-next').disabled = (index === this.currentPages.length - 1);

    // Render the page to fit the available space
    const holder = document.getElementById('modal-canvas-holder');
    const maxWidth = Math.max(240, Math.min(900, holder.clientWidth || window.innerWidth - 48));
    const maxHeight = Math.max(320, window.innerHeight * 0.7);
    const canvas = await this.renderer.renderFullPage(pdfDoc, pageInfo, maxWidth, maxHeight);
    if (this.modalCurrentIndex !== index || !this.isModalOpen()) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = `${canvas.width / ratio}px`;
    canvas.id = 'modal-canvas';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Preview of page ${index + 1}`);
    this.elements.modalCanvas.replaceWith(canvas);
    this.elements.modalCanvas = canvas;
  }

  closeModal() {
    if (!this.isModalOpen()) return;
    this.elements.modal.style.display = 'none';
    document.body.classList.remove('pdfc-modal-open');
    const page = this.currentPages[this.modalCurrentIndex];
    const card = page && this.cards.get(page.id);
    const target = card ? card.querySelector('.page-thumb-btn') : this._modalTrigger;
    if (target && target.isConnected) target.focus();
  }

  /**
   * Initialize modal handlers
   */
  initializeModalHandlers() {
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay').addEventListener('click', () => this.closeModal());

    // Navigation
    document.getElementById('modal-prev').addEventListener('click', () => {
      if (this.modalCurrentIndex > 0) this.showPageModal(this.modalCurrentIndex - 1);
    });
    document.getElementById('modal-next').addEventListener('click', () => {
      if (this.modalCurrentIndex < this.currentPages.length - 1) this.showPageModal(this.modalCurrentIndex + 1);
    });

    // Edits from the preview
    document.getElementById('modal-rotate-left').addEventListener('click', () => {
      this.rotatePages([this.modalCurrentIndex], -90);
      this.showPageModal(this.modalCurrentIndex);
    });
    document.getElementById('modal-rotate-right').addEventListener('click', () => {
      this.rotatePages([this.modalCurrentIndex], 90);
      this.showPageModal(this.modalCurrentIndex);
    });
    document.getElementById('modal-remove').addEventListener('click', () => {
      this.removePages([this.modalCurrentIndex]);
      if (this.currentPages.length === 0) {
        this.closeModal();
      } else {
        this.showPageModal(Math.min(this.modalCurrentIndex, this.currentPages.length - 1));
      }
    });

    // Keyboard navigation and a simple focus trap
    document.addEventListener('keydown', (e) => {
      if (!this.isModalOpen()) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal();
      } else if (e.key === 'ArrowLeft') {
        if (this.modalCurrentIndex > 0) this.showPageModal(this.modalCurrentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        if (this.modalCurrentIndex < this.currentPages.length - 1) this.showPageModal(this.modalCurrentIndex + 1);
      } else if (e.key === 'Tab') {
        const focusable = Array.from(this.elements.modal.querySelectorAll('button:not([disabled])'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
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
