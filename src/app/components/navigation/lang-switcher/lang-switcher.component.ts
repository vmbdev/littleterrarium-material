import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';

import { LangService } from '@services/lang.service';

@Component({
  selector: 'ltm-lang-switcher',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, TranslocoModule],
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {
  constructor(protected readonly langService: LangService) {}

  setLang(lang: string) {
    this.langService.setLang(lang);
  }
}
