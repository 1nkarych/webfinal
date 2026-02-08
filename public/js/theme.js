// theme.js
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.button = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.button = document.getElementById('theme-switcher');
            if (!this.button) {
                console.warn('Theme switcher not found');
                return;
            }
            this.applyTheme(this.currentTheme);
            this.button.addEventListener('click', () => this.toggleTheme());
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (this.button) {
            this.button.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }
}

// запуск
new ThemeManager();
