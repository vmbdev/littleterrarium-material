import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { LanguageService } from '@services/language/language.service';

@Component({
  selector: 'ltm-lang-switcher-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './lang-switcher-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherButtonComponent {
  protected readonly language = inject(LanguageService);
}
