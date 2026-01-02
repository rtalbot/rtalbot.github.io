/**
 * Color Scheme Switcher
 * Allows users to switch between different color themes
 */

const colorThemes = {
  dark: {
    name: 'Dark (Default)',
    colors: {
      '--c-base-03': '#0D2B35',
      '--c-base-02': '#163541',
      '--c-base-01': '#5C6E74',
      '--c-base-00': '#697B82',
      '--c-base-0': '#869395',
      '--c-base-1': '#96A0A0',
      '--c-base-2': '#EDE7D6',
      '--c-base-3': '#FCF5E4',
      '--c-accent-blue': '#0067FB',
      '--c-accent-darkblue': '#0029F9',
      '--c-accent-green': '#8BE367',
      '--c-accent-pink': '#ff597d',
      '--c-accent-lime-green': '#00FF00',
      '--c-body-bg': '#131418',
      '--c-text-primary': '#FFFFFF',
      '--c-text-secondary': '#C4CED1',
      '--c-border': '#EDE7D6',
      '--c-link': '#ff597d',
      '--c-link-hover': '#ff597d',
      '--c-hover-after': '#ff597d'
    }
  },
  ocean: {
    name: 'Ocean Blue',
    colors: {
      '--c-base-03': '#0A1628',
      '--c-base-02': '#1A2332',
      '--c-base-01': '#2C3E50',
      '--c-base-00': '#34495E',
      '--c-base-0': '#5D6D7E',
      '--c-base-1': '#7F8C8D',
      '--c-base-2': '#D6EAF8',
      '--c-base-3': '#EBF5FB',
      '--c-accent-blue': '#3498DB',
      '--c-accent-darkblue': '#2874A6',
      '--c-accent-green': '#1ABC9C',
      '--c-accent-pink': '#E74C3C',
      '--c-accent-lime-green': '#2ECC71',
      '--c-body-bg': '#0E1621',
      '--c-text-primary': '#F5F9FC',
      '--c-text-secondary': '#D0DBE5',
      '--c-border': '#BDC3C7',
      '--c-link': '#5DADE2',
      '--c-link-hover': '#3498DB',
      '--c-hover-after': '#5DADE2'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      '--c-base-03': '#2C1810',
      '--c-base-02': '#3D2314',
      '--c-base-01': '#6B4423',
      '--c-base-00': '#7C5733',
      '--c-base-0': '#9A7B5C',
      '--c-base-1': '#B39171',
      '--c-base-2': '#FFEAA7',
      '--c-base-3': '#FFF5E1',
      '--c-accent-blue': '#6C5CE7',
      '--c-accent-darkblue': '#5F3DC4',
      '--c-accent-green': '#00B894',
      '--c-accent-pink': '#FD79A8',
      '--c-accent-lime-green': '#FDCB6E',
      '--c-body-bg': '#1A0F08',
      '--c-text-primary': '#FFFAF0',
      '--c-text-secondary': '#E8C89E',
      '--c-border': '#FFEAA7',
      '--c-link': '#FDCB6E',
      '--c-link-hover': '#FFD93D',
      '--c-hover-after': '#FDCB6E'
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      '--c-base-03': '#0D2818',
      '--c-base-02': '#1A3A2E',
      '--c-base-01': '#2C5F4B',
      '--c-base-00': '#357454',
      '--c-base-0': '#4A8B6F',
      '--c-base-1': '#65A888',
      '--c-base-2': '#D5F4E6',
      '--c-base-3': '#E8F8F5',
      '--c-accent-blue': '#3498DB',
      '--c-accent-darkblue': '#2874A6',
      '--c-accent-green': '#52C41A',
      '--c-accent-pink': '#EB2F96',
      '--c-accent-lime-green': '#A0D911',
      '--c-body-bg': '#0A1810',
      '--c-text-primary': '#F0FFF4',
      '--c-text-secondary': '#BEE5CD',
      '--c-border': '#95D9B8',
      '--c-link': '#73D393',
      '--c-link-hover': '#52C41A',
      '--c-hover-after': '#73D393'
    }
  },
  midnight: {
    name: 'Midnight Purple',
    colors: {
      '--c-base-03': '#1A0B2E',
      '--c-base-02': '#2D1B4E',
      '--c-base-01': '#4B3869',
      '--c-base-00': '#5D4777',
      '--c-base-0': '#7D6A94',
      '--c-base-1': '#9985AC',
      '--c-base-2': '#E6D9F2',
      '--c-base-3': '#F5EFFF',
      '--c-accent-blue': '#7F7FD5',
      '--c-accent-darkblue': '#6C63FF',
      '--c-accent-green': '#A8E6CF',
      '--c-accent-pink': '#FF6B9D',
      '--c-accent-lime-green': '#C7CEEA',
      '--c-body-bg': '#0F0820',
      '--c-text-primary': '#FAF7FF',
      '--c-text-secondary': '#D4C7EA',
      '--c-border': '#B8A9D4',
      '--c-link': '#B794F6',
      '--c-link-hover': '#9F7AEA',
      '--c-hover-after': '#B794F6'
    }
  },
  light: {
    name: 'Light Mode',
    colors: {
      '--c-base-03': '#F8F9FA',
      '--c-base-02': '#E9ECEF',
      '--c-base-01': '#DEE2E6',
      '--c-base-00': '#CED4DA',
      '--c-base-0': '#ADB5BD',
      '--c-base-1': '#6C757D',
      '--c-base-2': '#343A40',
      '--c-base-3': '#212529',
      '--c-accent-blue': '#0056D2',
      '--c-accent-darkblue': '#003DA5',
      '--c-accent-green': '#28A745',
      '--c-accent-pink': '#DC3545',
      '--c-accent-lime-green': '#28A745',
      '--c-body-bg': '#FFFFFF',
      '--c-text-primary': '#1A1A1A',
      '--c-text-secondary': '#5A5A5A',
      '--c-border': '#DEE2E6',
      '--c-link': '#0066CC',
      '--c-link-hover': '#0052A3',
      '--c-hover-after': '#0066CC'
    }
  }
};

class ColorSchemeManager {
  constructor() {
    this.currentTheme = this.loadTheme();
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createPicker();
    this.attachEventListeners();
  }

  loadTheme() {
    return localStorage.getItem('colorTheme') || 'dark';
  }

  saveTheme(themeName) {
    localStorage.setItem('colorTheme', themeName);
  }

  applyTheme(themeName) {
    const theme = colorThemes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    this.currentTheme = themeName;
    this.saveTheme(themeName);
    this.updatePickerUI();
  }

  createPicker() {
    const picker = document.createElement('div');
    picker.className = 'color-scheme-picker';
    picker.innerHTML = `
      <button class="color-scheme-toggle" aria-label="Change color scheme" title="Change color scheme">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 1 0-20z"></path>
        </svg>
      </button>
      <div class="color-scheme-menu">
        ${Object.entries(colorThemes).map(([key, theme]) => `
          <button class="color-scheme-option" data-theme="${key}">
            <span class="theme-indicator"></span>
            ${theme.name}
          </button>
        `).join('')}
      </div>
    `;

    document.body.appendChild(picker);
  }

  attachEventListeners() {
    const toggle = document.querySelector('.color-scheme-toggle');
    const picker = document.querySelector('.color-scheme-picker');
    const options = document.querySelectorAll('.color-scheme-option');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      picker.classList.toggle('is-open');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        this.applyTheme(theme);
        picker.classList.remove('is-open');
      });
    });

    // Close picker when clicking outside
    document.addEventListener('click', (e) => {
      if (!picker.contains(e.target)) {
        picker.classList.remove('is-open');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        picker.classList.remove('is-open');
      }
    });
  }

  updatePickerUI() {
    const options = document.querySelectorAll('.color-scheme-option');
    options.forEach(option => {
      if (option.dataset.theme === this.currentTheme) {
        option.classList.add('is-active');
      } else {
        option.classList.remove('is-active');
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ColorSchemeManager();
  });
} else {
  new ColorSchemeManager();
}
