import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';

import { ToggleOptionComponent } from '@components/toggle-option/toggle-option.component';
import { ThemeService } from '@services/theme/theme.service';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';

/**
 * Theme Switcher component.
 * Note that the current implementation implies that there are only two
 * themes: light and dark. Check for the commented code on the template for a
 * list-based selector.
 */
@Component({
  selector: 'ltm-theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslocoModule,
    ToggleOptionComponent,
    CapitalizePipe,
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  protected readonly themeService = inject(ThemeService);

  setTheme(theme: string) {
    this.themeService.switchTheme(theme);
  }

  toggleDarkTheme() {
    if (this.themeService.$theme() === 'light') {
      this.themeService.switchTheme('dark');
    } else this.themeService.switchTheme('light');
  }
}
