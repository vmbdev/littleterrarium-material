import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'ltm-theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    CapitalizePipe
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  currentTheme = this.themeService.getTheme();

  constructor(public readonly themeService: ThemeService) {}

  setTheme(theme: string) {
    const res = this.themeService.switchTheme(theme);

    if (res) this.currentTheme = theme;
  }
}
