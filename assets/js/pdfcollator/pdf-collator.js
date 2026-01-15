/**
 * PDFCollator - Implements different collation strategies
 */

class PDFCollator {
  constructor() {
    this.strategies = {
      date: 'Date-based (Chronological)',
      filename: 'Filename-based (Alphabetical)',
      interleaved: 'Interleaved (Round-robin)',
      manual: 'Manual (Drag to reorder)',
      'final-billing': 'Final Billing (Invoice→Ledger→1500→Consent→SOAP)'
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
      case 'final-billing':
        orderedPages = this.collateByFinalBilling(pages, documents);
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
   * Strategy 4: Final Billing collation
   * Arrange documents by medical billing type: Invoice→Ledger→1500→Consent→SOAP
   */
  collateByFinalBilling(pages, documents) {
    // Create document map for lookups
    const docMap = new Map(documents.map(d => [d.id, d]));
    
    // Detect document types
    const detectedTypes = this.detectDocumentTypes(documents);
    
    // Define type order
    const typeOrder = {
      'invoice': 0,
      'ledger': 1,
      '1500': 2,
      'consent': 3,
      'soap': 4,
      'unknown': 5
    };
    
    // Sort pages by document type, then by page number within document
    return [...pages].sort((a, b) => {
      const docA = docMap.get(a.documentId);
      const docB = docMap.get(b.documentId);
      
      if (!docA || !docB) return 0;
      
      const typeA = detectedTypes.get(docA.id) || 'unknown';
      const typeB = detectedTypes.get(docB.id) || 'unknown';
      
      // First sort by document type
      const orderCompare = typeOrder[typeA] - typeOrder[typeB];
      if (orderCompare !== 0) return orderCompare;
      
      // If same type, sort by document order
      if (a.documentId !== b.documentId) {
        return documents.findIndex(d => d.id === a.documentId) - 
               documents.findIndex(d => d.id === b.documentId);
      }
      
      // If same document, sort by page number
      return a.pageNumber - b.pageNumber;
    });
  }
  
  /**
   * Detect document types for Final Billing strategy
   */
  detectDocumentTypes(documents) {
    const detectedTypes = new Map();
    
    for (const doc of documents) {
      // Get text from all pages
      const allText = doc.pages.map(p => p.text || '').join(' ');
      
      // Score each possible type
      const scores = {
        invoice: this.scoreInvoice(allText),
        ledger: this.scoreLedger(allText),
        '1500': this.score1500(allText),
        consent: this.scoreConsent(allText),
        soap: this.scoreSoap(allText)
      };
      
      // Find highest scoring type (minimum threshold: 30)
      let maxType = 'unknown';
      let maxScore = 30;
      
      for (const [type, score] of Object.entries(scores)) {
        if (score > maxScore) {
          maxScore = score;
          maxType = type;
        }
      }
      
      detectedTypes.set(doc.id, maxType);
      
      // Store detection info on document for debugging
      doc.detectedType = maxType;
      doc.detectionConfidence = maxScore;
    }
    
    return detectedTypes;
  }
  
  /**
   * Score text as Invoice
   */
  scoreInvoice(text) {
    let score = 0;
    const lower = text.toLowerCase();
    
    // Primary indicators
    if (/\binvoice\b/i.test(text.substring(0, text.length / 5))) score += 40;
    if (/invoice\s*#?\s*:?\s*\d+/i.test(text)) score += 25;
    if (/balance\s+due/i.test(text)) score += 15;
    if (/dates?\s+of\s+service/i.test(text)) score += 10;
    if (/\$\s*[\d,]+\.?\d*/g.test(text)) score += 10;
    if (/submitted\s*:/i.test(text)) score += 10;
    if (/invoice\s+for\s+patient/i.test(text)) score += 15;
    if (/office\s+visits?|tm\s+visits?/i.test(text)) score += 10;
    
    return score;
  }
  
  /**
   * Score text as Ledger
   */
  scoreLedger(text) {
    let score = 0;
    
    if (/\bledger\b/i.test(text)) score += 50;
    if (/account\s+ledger/i.test(text)) score += 50;
    if (/total\s+charges/i.test(text)) score += 20;
    if (/patient\s+account/i.test(text)) score += 15;
    if (/encounter\s+date/i.test(text)) score += 10;
    
    // Look for multiple dated entries with charges
    const dateAmountPattern = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s+.*?\$\s*[\d,]+/gi;
    const matches = text.match(dateAmountPattern);
    if (matches && matches.length >= 3) score += 15;
    
    return score;
  }
  
  /**
   * Score text as HCFA 1500
   */
  score1500(text) {
    let score = 0;
    
    if (/health\s+insurance\s+claim\s+form/i.test(text)) score += 50;
    if (/\b(1500|cms[- ]?1500|hcfa)\b/i.test(text)) score += 30;
    if (/diagnosis\s+or\s+nature\s+of\s+illness/i.test(text)) score += 15;
    if (/procedures?,\s*services?,\s*or\s+supplies/i.test(text)) score += 15;
    if (/\bnpi\b/i.test(text)) score += 10;
    
    // Check for box number patterns
    if (/\b\d{1,2}\.\s+[A-Z]/g.test(text)) score += 10;
    
    // ICD/CPT code patterns
    if (/\b[A-Z]\d{2}\.\d{1,2}\b/g.test(text)) score += 10; // ICD-10
    if (/\b\d{5}\b/g.test(text)) score += 5; // CPT codes
    
    return score;
  }
  
  /**
   * Score text as Consent
   */
  scoreConsent(text) {
    let score = 0;
    
    if (/\bconsent\b/i.test(text.substring(0, text.length / 5))) score += 40;
    if (/patient\s+health\s+consent/i.test(text)) score += 30;
    if (/i\s+(?:hereby\s+)?(?:consent|authorize|agree)/i.test(text)) score += 15;
    if (/signature.*patient/i.test(text)) score += 10;
    if (/\bhipaa\b/i.test(text)) score += 5;
    if (/authorization/i.test(text)) score += 10;
    if (/witness/i.test(text)) score += 5;
    
    return score;
  }
  
  /**
   * Score text as SOAP Notes
   */
  scoreSoap(text) {
    let score = 0;
    
    if (/\bsoap\b/i.test(text)) score += 30;
    
    // Check for SOAP headers
    if (/\bsubjective\s*:/i.test(text)) score += 10;
    if (/\bobjective\s*:/i.test(text)) score += 10;
    if (/\bassessment\s*:/i.test(text)) score += 10;
    if (/\bplan\s*:/i.test(text)) score += 10;
    
    // Check for abbreviated SOAP notation
    if (/\bS\s*:/i.test(text)) score += 8;
    if (/\bO\s*:/i.test(text)) score += 8;
    if (/\bA\s*:/i.test(text)) score += 8;
    if (/\bP\s*:/i.test(text)) score += 8;
    
    if (/chief\s+complaint|c\.?c\.?\s*:/i.test(text)) score += 10;
    if (/vital\s+signs|bp\s*:|hr\s*:/i.test(text)) score += 10;
    if (/date\s+of\s+visit|dos\s*:/i.test(text)) score += 10;
    if (/oswestry|disability\s+form/i.test(text)) score += 10;
    
    return score;
  }

  /**
   * 

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
