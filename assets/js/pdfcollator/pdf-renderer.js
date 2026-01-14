/**
 * PDFRenderer - Renders PDF pages to canvas thumbnails
 */

class PDFRenderer {
  constructor() {
    this.thumbnailCache = new Map(); // pageId -> canvas
    this.maxCacheSize = 100;
    this.defaultScale = 0.5; // Scale for thumbnails
  }

  /**
   * Render a page thumbnail
   */
  async renderThumbnail(pdfDoc, pageInfo, scale = this.defaultScale) {
    // Check cache
    const cacheKey = `${pageInfo.id}-${scale}`;
    if (this.thumbnailCache.has(cacheKey)) {
      return this.thumbnailCache.get(cacheKey);
    }

    try {
      const page = await pdfDoc.pdfDoc.getPage(pageInfo.pageNumber);
      const viewport = page.getViewport({ scale });

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext('2d');
      context.imageSmoothingEnabled = false;

      // Render page
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;

      // Highlight dates if present
      if (pageInfo.dates.length > 0) {
        await this.highlightDates(context, page, pageInfo.dates, scale);
      }

      // Cache the canvas
      this.cacheCanvas(cacheKey, canvas);

      return canvas;
    } catch (error) {
      console.error('Error rendering thumbnail:', error);
      return this.createErrorCanvas();
    }
  }

  /**
   * Highlight dates on canvas
   */
  async highlightDates(context, page, dates, scale) {
    try {
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale });

      for (const date of dates) {
        // Find text items that match the date
        const matchingItems = textContent.items.filter(item => 
          item.str && date.originalText.includes(item.str)
        );

        for (const item of matchingItems) {
          // Transform coordinates
          const transform = item.transform;
          const x = transform[4] * scale;
          const y = viewport.height - (transform[5] * scale);
          const width = item.width * scale;
          const height = item.height * scale;

          // Draw highlight
          context.save();
          context.fillStyle = 'rgba(255, 245, 157, 0.5)'; // Yellow highlight
          context.fillRect(x, y - height, width, height);
          context.restore();
        }
      }
    } catch (error) {
      console.debug('Could not highlight dates:', error);
      // Non-critical error, continue without highlights
    }
  }

  /**
   * Render full-size page for modal
   */
  async renderFullPage(pdfDoc, pageInfo, maxWidth = 600) {
    try {
      const page = await pdfDoc.pdfDoc.getPage(pageInfo.pageNumber);
      const viewport = page.getViewport({ scale: 1.0 });

      // Calculate scale to fit maxWidth
      const scale = Math.min(maxWidth / viewport.width, 2.0);
      const scaledViewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      const context = canvas.getContext('2d');

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };

      await page.render(renderContext).promise;

      // Highlight dates
      if (pageInfo.dates.length > 0) {
        await this.highlightDates(context, page, pageInfo.dates, scale);
      }

      return canvas;
    } catch (error) {
      console.error('Error rendering full page:', error);
      return this.createErrorCanvas();
    }
  }

  /**
   * Create error canvas
   */
  createErrorCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 280;
    const context = canvas.getContext('2d');

    // Draw error state
    context.fillStyle = '#f8f9fa';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#6c757d';
    context.font = '14px sans-serif';
    context.textAlign = 'center';
    context.fillText('Error rendering', canvas.width / 2, canvas.height / 2);
    context.fillText('PDF page', canvas.width / 2, canvas.height / 2 + 20);

    return canvas;
  }

  /**
   * Cache canvas
   */
  cacheCanvas(key, canvas) {
    // LRU eviction if cache is full
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
    for (const [key, _] of this.thumbnailCache) {
      if (key.startsWith(documentId)) {
        this.thumbnailCache.delete(key);
      }
    }
  }

  /**
   * Convert canvas to blob
   */
  async canvasToBlob(canvas, type = 'image/png') {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, type);
    });
  }
}

// Make it available globally
window.PDFRenderer = PDFRenderer;
