/**
 * PDFRenderer - Renders PDF pages to canvas thumbnails
 */

class PDFRenderer {
  constructor() {
    this.thumbnailCache = new Map(); // documentId|pageId|rotation|width -> canvas
    this.maxCacheSize = 300;
    this.thumbnailWidth = 240; // CSS pixels; multiplied by devicePixelRatio
  }

  /**
   * Total rotation for a page: the PDF's own /Rotate plus the user's choice
   */
  totalRotation(page, pageInfo) {
    return ((page.rotate || 0) + (pageInfo.rotation || 0)) % 360;
  }

  /**
   * Render a page thumbnail (cached per rotation)
   */
  async renderThumbnail(pdfDoc, pageInfo) {
    const pixelWidth = Math.round(this.thumbnailWidth * Math.min(window.devicePixelRatio || 1, 2));
    const cacheKey = `${pdfDoc.id}|${pageInfo.id}|${pageInfo.rotation || 0}|${pixelWidth}`;
    if (this.thumbnailCache.has(cacheKey)) {
      return this.cloneCanvas(this.thumbnailCache.get(cacheKey));
    }

    try {
      const canvas = await this.renderToWidth(pdfDoc, pageInfo, pixelWidth);
      this.cacheCanvas(cacheKey, canvas);
      return this.cloneCanvas(canvas);
    } catch (error) {
      console.error('Error rendering thumbnail:', error);
      return this.createErrorCanvas();
    }
  }

  /**
   * Render full-size page for the preview modal
   */
  async renderFullPage(pdfDoc, pageInfo, maxWidth = 900, maxHeight = 1200) {
    try {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const page = await pdfDoc.pdfDoc.getPage(pageInfo.pageNumber);
      const rotation = this.totalRotation(page, pageInfo);
      const base = page.getViewport({ scale: 1.0, rotation });
      const scale = Math.min(maxWidth / base.width, maxHeight / base.height, 2.5) * ratio;
      return await this.renderPage(page, pageInfo, scale, rotation);
    } catch (error) {
      console.error('Error rendering full page:', error);
      return this.createErrorCanvas();
    }
  }

  /**
   * Render a page so that its (rotated) width is pixelWidth
   */
  async renderToWidth(pdfDoc, pageInfo, pixelWidth) {
    const page = await pdfDoc.pdfDoc.getPage(pageInfo.pageNumber);
    const rotation = this.totalRotation(page, pageInfo);
    const base = page.getViewport({ scale: 1.0, rotation });
    // Keep very tall pages from producing huge canvases
    const scale = Math.min(pixelWidth / base.width, (pixelWidth * 1.6) / base.height);
    return this.renderPage(page, pageInfo, scale, rotation);
  }

  async renderPage(page, pageInfo, scale, rotation) {
    const viewport = page.getViewport({ scale, rotation });

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: context, viewport }).promise;

    if (pageInfo.dates && pageInfo.dates.length > 0) {
      await this.highlightDates(context, page, pageInfo.dates, viewport);
    }

    return canvas;
  }

  /**
   * Highlight detected dates on the canvas.
   * Text items are usually whole lines, so the highlight covers the part of
   * the line that holds the date (estimated from character offsets).
   */
  async highlightDates(context, page, dates, viewport) {
    try {
      const textContent = await page.getTextContent();
      const Util = window.pdfjsLib.Util;

      context.save();
      context.fillStyle = 'rgba(255, 213, 0, 0.35)';

      for (const item of textContent.items) {
        const str = item.str || '';
        if (str.trim().length < 4) continue;

        for (const date of dates) {
          const start = str.indexOf(date.originalText);
          if (start === -1) continue;

          // Item transform -> viewport space (handles scale and rotation)
          const tx = Util.transform(viewport.transform, item.transform);
          const fontHeight = Math.hypot(tx[2], tx[3]);
          const angle = Math.atan2(tx[1], tx[0]);
          const itemWidth = item.width * viewport.scale;
          const from = itemWidth * (start / str.length);
          const width = itemWidth * (date.originalText.length / str.length);

          context.save();
          context.translate(tx[4], tx[5]);
          context.rotate(angle);
          context.fillRect(from, -fontHeight, width, fontHeight * 1.2);
          context.restore();
        }
      }

      context.restore();
    } catch (error) {
      // Non-critical, continue without highlights
      console.debug('Could not highlight dates:', error);
    }
  }

  /**
   * Copy a cached canvas so the cached one is never moved around the DOM
   */
  cloneCanvas(source) {
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    canvas.getContext('2d').drawImage(source, 0, 0);
    return canvas;
  }

  /**
   * Create error canvas
   */
  createErrorCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 280;
    const context = canvas.getContext('2d');

    context.fillStyle = '#f8f9fa';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#6c757d';
    context.font = '14px sans-serif';
    context.textAlign = 'center';
    context.fillText('Could not render', canvas.width / 2, canvas.height / 2);
    context.fillText('this page', canvas.width / 2, canvas.height / 2 + 20);

    return canvas;
  }

  /**
   * Cache canvas
   */
  cacheCanvas(key, canvas) {
    // Evict oldest entry if cache is full
    if (this.thumbnailCache.size >= this.maxCacheSize) {
      const firstKey = this.thumbnailCache.keys().next().value;
      this.thumbnailCache.delete(firstKey);
    }

    this.thumbnailCache.set(key, canvas);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.thumbnailCache.clear();
  }

  /**
   * Remove cached thumbnails for a document
   */
  clearDocumentCache(documentId) {
    for (const key of Array.from(this.thumbnailCache.keys())) {
      if (key.startsWith(documentId + '|')) {
        this.thumbnailCache.delete(key);
      }
    }
  }
}

// Make it available globally
window.PDFRenderer = PDFRenderer;
