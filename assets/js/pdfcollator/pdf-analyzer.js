/**
 * PDFAnalyzer - Extracts text and detects dates from PDFs
 */

class PDFAnalyzer {
  constructor() {
    // Date patterns (regex)
    this.datePatterns = [
      // MM/DD/YYYY, MM-DD-YYYY
      {
        regex: /\b(0?[1-9]|1[0-2])[-\/](0?[1-9]|[12]\d|3[01])[-\/](19|20)\d{2}\b/g,
        type: 'MM/DD/YYYY'
      },
      // DD/MM/YYYY, DD-MM-YYYY  
      {
        regex: /\b(0?[1-9]|[12]\d|3[01])[-\/](0?[1-9]|1[0-2])[-\/](19|20)\d{2}\b/g,
        type: 'DD/MM/YYYY'
      },
      // YYYY-MM-DD (ISO)
      {
        regex: /\b(19|20)\d{2}[-\/](0?[1-9]|1[0-2])[-\/](0?[1-9]|[12]\d|3[01])\b/g,
        type: 'YYYY-MM-DD'
      },
      // Month DD, YYYY
      {
        regex: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(0?[1-9]|[12]\d|3[01]),?\s+(19|20)\d{2}\b/gi,
        type: 'Month DD, YYYY'
      },
      // DD Month YYYY
      {
        regex: /\b(0?[1-9]|[12]\d|3[01])\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(19|20)\d{2}\b/gi,
        type: 'DD Month YYYY'
      },
      // Mon DD, YYYY
      {
        regex: /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(0?[1-9]|[12]\d|3[01]),?\s+(19|20)\d{2}\b/gi,
        type: 'Mon DD, YYYY'
      }
    ];

    this.monthNames = {
      'january': 0, 'jan': 0,
      'february': 1, 'feb': 1,
      'march': 2, 'mar': 2,
      'april': 3, 'apr': 3,
      'may': 4,
      'june': 5, 'jun': 5,
      'july': 6, 'jul': 6,
      'august': 7, 'aug': 7,
      'september': 8, 'sep': 8,
      'october': 9, 'oct': 9,
      'november': 10, 'nov': 10,
      'december': 11, 'dec': 11
    };
  }

  /**
   * Analyze a PDF document
   */
  async analyzeDocument(document, progressCallback = null) {
    const pages = [];

    for (let i = 0; i < document.pageCount; i++) {
      const pageInfo = await this.analyzePage(document, i);
      pages.push(pageInfo);

      if (progressCallback) {
        progressCallback((i + 1) / document.pageCount);
      }
    }

    document.pages = pages;
    return pages;
  }

  /**
   * Analyze a single page
   */
  async analyzePage(document, pageIndex) {
    const page = await document.pdfDoc.getPage(pageIndex + 1); // PDF.js is 1-indexed

    // Extract text
    const text = await this.extractText(page);

    // Detect dates
    const dates = this.detectDates(text);

    // Get page dimensions
    const viewport = page.getViewport({ scale: 1.0 });

    return {
      id: PDFCollatorUtils.generateId(),
      documentId: document.id,
      pageIndex: pageIndex,
      pageNumber: pageIndex + 1, // Human-readable (1-indexed)
      width: viewport.width,
      height: viewport.height,
      text: text,
      dates: dates,
      primaryDate: dates.length > 0 ? dates[0].value : null,
      thumbnail: null, // Will be set by renderer
      analyzed: true
    };
  }

  /**
   * Extract text from a page
   */
  async extractText(page) {
    try {
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map(item => item.str)
        .join(' ');
      return text;
    } catch (error) {
      console.error('Error extracting text:', error);
      return '';
    }
  }

  /**
   * Detect dates in text
   */
  detectDates(text) {
    const detectedDates = [];
    const seenDates = new Set(); // Avoid duplicates

    for (const pattern of this.datePatterns) {
      const matches = text.matchAll(pattern.regex);

      for (const match of matches) {
        try {
          const dateStr = match[0];
          const date = this.parseDate(dateStr, pattern.type);

          if (date && this.isValidDate(date)) {
            const dateKey = date.toISOString();
            
            if (!seenDates.has(dateKey)) {
              seenDates.add(dateKey);
              detectedDates.push({
                value: date,
                originalText: dateStr,
                pattern: pattern.type,
                confidence: this.calculateConfidence(dateStr, pattern.type)
              });
            }
          }
        } catch (error) {
          // Skip invalid dates
          console.debug('Failed to parse date:', match[0], error);
        }
      }
    }

    // Sort by confidence
    detectedDates.sort((a, b) => b.confidence - a.confidence);

    return detectedDates;
  }

  /**
   * Parse date string
   */
  parseDate(dateStr, patternType) {
    try {
      // Try different parsing strategies based on pattern type
      
      if (patternType === 'YYYY-MM-DD') {
        return new Date(dateStr);
      }
      
      if (patternType.includes('Month')) {
        // Parse month name
        const parts = dateStr.split(/[\s,]+/);
        let month, day, year;

        if (patternType === 'Month DD, YYYY') {
          month = this.monthNames[parts[0].toLowerCase()];
          day = parseInt(parts[1]);
          year = parseInt(parts[2]);
        } else { // DD Month YYYY
          day = parseInt(parts[0]);
          month = this.monthNames[parts[1].toLowerCase()];
          year = parseInt(parts[2]);
        }

        return new Date(year, month, day);
      }

      // For MM/DD/YYYY or DD/MM/YYYY
      const parts = dateStr.split(/[-\/]/);
      const num1 = parseInt(parts[0]);
      const num2 = parseInt(parts[1]);
      const year = parseInt(parts[2]);

      // Heuristic: if first number > 12, it's DD/MM/YYYY
      if (num1 > 12) {
        return new Date(year, num2 - 1, num1);
      }
      // Otherwise, default to MM/DD/YYYY (US format)
      return new Date(year, num1 - 1, num2);

    } catch (error) {
      return null;
    }
  }

  /**
   * Validate date
   */
  isValidDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return false;
    }

    // Reasonable date range: 1950 - 2050
    const year = date.getFullYear();
    return year >= 1950 && year <= 2050;
  }

  /**
   * Calculate confidence score
   */
  calculateConfidence(dateStr, patternType) {
    let confidence = 0.7; // Base confidence

    // ISO format is most reliable
    if (patternType === 'YYYY-MM-DD') {
      confidence = 0.95;
    }
    // Full month names are reliable
    else if (patternType.includes('Month') && !patternType.includes('Mon')) {
      confidence = 0.90;
    }
    // Abbreviated month names
    else if (patternType.includes('Mon')) {
      confidence = 0.85;
    }

    return confidence;
  }

  /**
   * Get all pages from all documents
   */
  async getAllPages(documents, progressCallback = null) {
    const allPages = [];
    let totalPages = documents.reduce((sum, doc) => sum + doc.pageCount, 0);
    let processedPages = 0;

    for (const document of documents) {
      // Analyze document if not already analyzed
      if (document.pages.length === 0) {
        await this.analyzeDocument(document, (docProgress) => {
          if (progressCallback) {
            const overallProgress = (processedPages + (docProgress * document.pageCount)) / totalPages;
            progressCallback(overallProgress);
          }
        });
      }

      allPages.push(...document.pages);
      processedPages += document.pageCount;

      if (progressCallback) {
        progressCallback(processedPages / totalPages);
      }
    }

    return allPages;
  }
}

// Make it available globally
window.PDFAnalyzer = PDFAnalyzer;
