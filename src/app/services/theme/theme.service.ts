import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

import { AuthService } from '@services/auth/auth.service';
import {
  theme as configTheme,
  availableThemes as configAvailableThemes,
} from '@config';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly overlayContainer = inject(OverlayContainer);
  private readonly auth = inject(AuthService);

  readonly #$theme: WritableSignal<string>;
  public readonly $theme;
  readonly availableThemes: string[] = configAvailableThemes;

  /**
   * Defines the theme to use.
   * First it checks in user prefs, then in the config file, and if it all
   * fails then it tries to get the first one in availableThemes.
   * If everything fails, it sets an empty theme.
   */
  constructor() {
    let newTheme: string;
    const storedTheme = this.auth.getPref('theme');

    if (storedTheme && this.availableThemes.includes(storedTheme)) {
      newTheme = storedTheme;
    } else if (this.availableThemes.includes(configTheme)) {
      newTheme = configTheme;
    } else if (this.availableThemes.length > 0) {
      newTheme = this.availableThemes[0];
    } else newTheme = '';

    this.#$theme = signal(newTheme);
    this.$theme = this.#$theme.asReadonly();

    if (newTheme) this.setOverlayTheme(newTheme);
  }

  switchTheme(newTheme: string): Observable<any> {
    if (this.availableThemes.includes(newTheme)) {
      this.setOverlayTheme(newTheme, this.#$theme());
      this.#$theme.set(newTheme);

      return this.auth.setPref({ theme: newTheme });
    } else return of(null);
  }

  setOverlayTheme(newTheme: string, prevTheme?: string): void {
    const classList = this.overlayContainer.getContainerElement().classList;
      
    if (prevTheme) classList.remove(`${prevTheme}-theme`);

    classList.add(`${newTheme}-theme`);
  }
}
