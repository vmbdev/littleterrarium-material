import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';

import { ThemeService } from '@services/theme.service';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';

@Component({
  selector: 'ltm-theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslocoModule,
    CapitalizePipe,
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
})
export class ThemeSwitcherComponent {
  constructor(public readonly themeService: ThemeService) {}

  setTheme(theme: string) {
    this.themeService.switchTheme(theme);
  }
}
