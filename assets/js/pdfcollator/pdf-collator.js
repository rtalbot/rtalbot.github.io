/**
 * PDFCollator - Implements different collation strategies
 */

class PDFCollator {
  constructor() {
    this.strategies = {
      date: 'Date-based (Chronological)',
      filename: 'Filename-based (Alphabetical)',
      interleaved: 'Interleaved (Round-robin)',
      manual: 'Manual (Drag to reorder)'
    };
  }

  /**
   * Collate pages using the specified strategy
   */
  collate(pages, documents, strategy = 'date') {
    let orderedPages = [];

    switch (strategy) {
      case 'date':
        orderedPages = this.collateByDate(pages);
        break;
      case 'filename':
        orderedPages = this.collateByFilename(pages, documents);
        break;
      case 'interleaved':
        orderedPages = this.collateInterleaved(documents);
        break;
      case 'manual':
        // Manual mode just returns pages as-is (user will reorder)
        orderedPages = [...pages];
        break;
      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }

    return {
      orderedPages,
      strategy,
      statistics: this.calculateStatistics(orderedPages)
    };
  }

  /**
   * Strategy 1: Date-based collation
   * Sort pages by their primary detected date
   */
  collateByDate(pages) {
    // Separate pages with and without dates
    const withDates = pages.filter(p => p.primaryDate !== null);
    const withoutDates = pages.filter(p => p.primaryDate === null);

    // Sort pages with dates chronologically
    withDates.sort((a, b) => {
      const dateA = new Date(a.primaryDate);
      const dateB = new Date(b.primaryDate);
      return dateA - dateB;
    });

    // Pages without dates go at the end, maintaining their original order
    return [...withDates, ...withoutDates];
  }

  /**
   * Strategy 2: Filename-based collation
   * Sort by filename, then by page number
   */
  collateByFilename(pages, documents) {
    // Create a map of documentId -> filename
    const filenameMap = new Map();
    documents.forEach(doc => {
      filenameMap.set(doc.id, doc.filename);
    });

    // Sort pages
    return [...pages].sort((a, b) => {
      const filenameA = filenameMap.get(a.documentId) || '';
      const filenameB = filenameMap.get(b.documentId) || '';

      // First compare filenames
      const nameCompare = filenameA.localeCompare(filenameB);
      if (nameCompare !== 0) return nameCompare;

      // Then compare page numbers
      return a.pageNumber - b.pageNumber;
    });
  }

  /**
   * Strategy 3: Interleaved collation
   * Interleave pages from all documents (round-robin)
   */
  collateInterleaved(documents) {
    const result = [];
    const maxPages = Math.max(...documents.map(d => d.pages.length));

    // Interleave: take page 1 from each doc, then page 2 from each, etc.
    for (let pageIndex = 0; pageIndex < maxPages; pageIndex++) {
      for (const document of documents) {
        if (pageIndex < document.pages.length) {
          result.push(document.pages[pageIndex]);
        }
      }
    }

    return result;
  }

  /**
   * Calculate statistics about the collation
   */
  calculateStatistics(pages) {
    const stats = {
      totalPages: pages.length,
      pagesWithDates: 0,
      pagesWithoutDates: 0,
      dateRange: null,
      documentsIncluded: new Set()
    };

    const dates = [];

    for (const page of pages) {
      stats.documentsIncluded.add(page.documentId);

      if (page.primaryDate) {
        stats.pagesWithDates++;
        dates.push(new Date(page.primaryDate));
      } else {
        stats.pagesWithoutDates++;
      }
    }

    // Calculate date range
    if (dates.length > 0) {
      dates.sort((a, b) => a - b);
      stats.dateRange = {
        start: dates[0],
        end: dates[dates.length - 1]
      };
    }

    stats.documentsIncluded = stats.documentsIncluded.size;

    return stats;
  }

  /**
   * Apply manual reordering
   * Used when user drags to reorder pages
   */
  applyManualOrder(pages, fromIndex, toIndex) {
    const result = [...pages];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }

  /**
   * Get strategy display name
   */
  getStrategyName(strategy) {
    return this.strategies[strategy] || strategy;
  }

  /**
   * Get available strategies
   */
  getAvailableStrategies() {
    return Object.keys(this.strategies).map(key => ({
      value: key,
      label: this.strategies[key]
    }));
  }
}

// Make it available globally
window.PDFCollator = PDFCollator;
