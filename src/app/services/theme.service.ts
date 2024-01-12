import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';

import {
  theme as configTheme,
  availableThemes as configAvailableThemes,
} from '@config';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme$: BehaviorSubject<string>;
  readonly availableThemes: string[];

  /**
   * Defines the theme to use.
   * First it checks in localStorage, then in the config file, and if it all
   * fails then it tries to get the first one in availableThemes.
   * If everything fails, it sets an empty theme.
   */
  constructor(private readonly overlayContainer: OverlayContainer) {
    let newTheme: string;
    const storedTheme = localStorage.getItem('LT_theme');

    this.availableThemes = configAvailableThemes;

    if (storedTheme && this.availableThemes.includes(storedTheme)) {
      newTheme = storedTheme;
    } else if (this.availableThemes.includes(configTheme)) {
      newTheme = configTheme;
    } else if (this.availableThemes.length > 0) {
      newTheme = this.availableThemes[0];
    } else newTheme = '';

    this.theme$ = new BehaviorSubject<string>(newTheme);

    if (newTheme) this.setOverlayTheme(newTheme);
  }

  getTheme(): string {
    return this.theme$.getValue();
  }

  switchTheme(newTheme: string) {
    if (this.availableThemes.includes(newTheme)) {
      const prevTheme = this.getTheme();
      this.setOverlayTheme(newTheme, prevTheme);
      this.theme$.next(newTheme);

      localStorage.setItem('LT_theme', newTheme);
    }
  }

  setOverlayTheme(newTheme: string, prevTheme?: string): void {
    const classList = this.overlayContainer.getContainerElement().classList;
      
    if (prevTheme) classList.remove(`${prevTheme}-theme`);

    classList.add(`${newTheme}-theme`);
  }
}
