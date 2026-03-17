// src/app/shared/services/theme/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  
  // Use a signal for reactive theme state
  readonly currentTheme = signal<Theme>(
    (localStorage.getItem(this.STORAGE_KEY) as Theme) || 'light'
  );

  constructor() {
    // Automatically persist theme changes to localStorage
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, this.currentTheme());
      document.body.classList.toggle('dark-mode', this.currentTheme() === 'dark');
    });
  }

  toggleTheme() {
    this.currentTheme.update(theme => theme === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }
}

// src/app/shared/services/theme/index.ts
export * from './theme.service';
