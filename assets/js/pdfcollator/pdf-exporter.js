/**
 * PDFExporter - Creates and exports merged PDF files
 */

class PDFExporter {
  constructor(fileManager) {
    this.fileManager = fileManager;
  }

  /**
   * Create merged PDF from ordered pages
   * progressCallback(fraction) is called as pages are copied.
   */
  async createMergedPDF(orderedPages, title = 'Collated PDF Document', progressCallback = null) {
    try {
      const { PDFDocument, degrees } = window.PDFLib;

      // Create new PDF document
      const mergedPdf = await PDFDocument.create();

      // pdf-lib documents, parsed once per source (cache)
      const loadedPdfs = new Map();

      for (let i = 0; i < orderedPages.length; i++) {
        const pageInfo = orderedPages[i];

        // Get source document
        const document = this.fileManager.getDocument(pageInfo.documentId);
        if (!document) {
          throw new Error('a page belongs to a file that has been removed. Re-sort and try again.');
        }

        let srcPdf = loadedPdfs.get(document.id);
        if (!srcPdf) {
          srcPdf = document.libDoc || await PDFDocument.load(document.pdfBytes);
          loadedPdfs.set(document.id, srcPdf);
        }

        // Copy page (pdf-lib uses 0-based indexing)
        const [copiedPage] = await mergedPdf.copyPages(srcPdf, [pageInfo.pageIndex]);

        // Apply the user's rotation on top of the page's own /Rotate
        if (pageInfo.rotation) {
          const current = copiedPage.getRotation().angle || 0;
          copiedPage.setRotation(degrees((((current + pageInfo.rotation) % 360) + 360) % 360));
        }

        mergedPdf.addPage(copiedPage);

        if (progressCallback) progressCallback((i + 1) / orderedPages.length);
      }

      // Set metadata
      mergedPdf.setTitle(title);
      mergedPdf.setCreator('PDF Collator (rjtalbot.com)');
      mergedPdf.setProducer('PDF Collator (pdf-lib)');
      mergedPdf.setCreationDate(new Date());

      return await mergedPdf.save();

    } catch (error) {
      console.error('Error creating merged PDF:', error);
      throw new Error(`Could not create the PDF: ${error.message}`);
    }
  }

  /**
   * Export PDF and trigger download
   */
  async exportPDF(orderedPages, filename = null, progressCallback = null) {
    try {
      if (orderedPages.length === 0) {
        throw new Error('there are no pages to save.');
      }

      filename = PDFCollatorUtils.sanitizeFilename(
        filename, `collated-${PDFCollatorUtils.localDateStamp()}`
      );

      const title = filename.replace(/\.pdf$/i, '');
      const pdfBytes = await this.createMergedPDF(orderedPages, title, progressCallback);

      // Create blob and trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      PDFCollatorUtils.downloadFile(blob, filename);

      return { success: true, filename, size: blob.size };

    } catch (error) {
      console.error('Error exporting PDF:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get export statistics
   */
  getExportStats(orderedPages) {
    const stats = {
      pageCount: orderedPages.length,
      sourceDocuments: new Set(orderedPages.map(p => p.documentId)).size,
      estimatedSize: this.estimateSize(orderedPages)
    };

    return stats;
  }

  /**
   * Estimate output file size
   * Rough approximation based on source documents
   */
  estimateSize(orderedPages) {
    const documentSizes = new Map();

    for (const page of orderedPages) {
      const document = this.fileManager.getDocument(page.documentId);
      if (document) {
        if (!documentSizes.has(document.id)) {
          documentSizes.set(document.id, {
            totalSize: document.fileSize,
            totalPages: document.pageCount,
            usedPages: 0
          });
        }
        documentSizes.get(document.id).usedPages++;
      }
    }

    // Estimate based on average page size
    let estimatedSize = 0;
    for (const [_, data] of documentSizes) {
      const avgPageSize = data.totalSize / data.totalPages;
      estimatedSize += avgPageSize * data.usedPages;
    }

    return Math.round(estimatedSize);
  }
}

// Make it available globally
window.PDFExporter = PDFExporter;
