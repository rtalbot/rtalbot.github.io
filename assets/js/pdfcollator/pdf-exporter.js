/**
 * PDFExporter - Creates and exports merged PDF files
 */

class PDFExporter {
  constructor(fileManager) {
    this.fileManager = fileManager;
  }

  /**
   * Create merged PDF from ordered pages
   */
  async createMergedPDF(orderedPages) {
    try {
      const { PDFDocument } = window.PDFLib;
      
      // Create new PDF document
      const mergedPdf = await PDFDocument.create();

      // Keep track of loaded PDFs (cache)
      const loadedPdfs = new Map();

      for (const pageInfo of orderedPages) {
        // Get source document
        const document = this.fileManager.getDocument(pageInfo.documentId);
        if (!document) {
          console.warn(`Document not found for page ${pageInfo.id}`);
          continue;
        }

        // Load PDF with pdf-lib (cache to avoid reloading)
        let srcPdf;
        if (loadedPdfs.has(document.id)) {
          srcPdf = loadedPdfs.get(document.id);
        } else {
          srcPdf = await PDFDocument.load(document.pdfBytes);
          loadedPdfs.set(document.id, srcPdf);
        }

        // Copy page (pdf-lib uses 0-based indexing)
        const [copiedPage] = await mergedPdf.copyPages(srcPdf, [pageInfo.pageIndex]);
        mergedPdf.addPage(copiedPage);
      }

      // Set metadata
      mergedPdf.setTitle('Collated PDF Document');
      mergedPdf.setCreator('PDF Collator Web App');
      mergedPdf.setProducer('PDF Collator Web App');
      mergedPdf.setCreationDate(new Date());

      // Save PDF
      const pdfBytes = await mergedPdf.save();
      return pdfBytes;

    } catch (error) {
      console.error('Error creating merged PDF:', error);
      throw new Error(`Failed to create PDF: ${error.message}`);
    }
  }

  /**
   * Export PDF and trigger download
   */
  async exportPDF(orderedPages, filename = null) {
    try {
      // Generate filename if not provided
      if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `collated-${timestamp}.pdf`;
      }

      // Ensure .pdf extension
      if (!filename.toLowerCase().endsWith('.pdf')) {
        filename += '.pdf';
      }

      // Create merged PDF
      const pdfBytes = await this.createMergedPDF(orderedPages);

      // Create blob and trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      PDFCollatorUtils.downloadFile(blob, filename);

      return { success: true, filename };

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
