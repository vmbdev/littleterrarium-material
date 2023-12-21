import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  TranslocoService,
  TranslocoModule,
  LangDefinition,
} from '@ngneat/transloco';

@Component({
  selector: 'ltm-lang-switcher',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, TranslocoModule],
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss'],
})
export class LangSwitcherComponent {
  storedLanguage = localStorage.getItem('LT_lang');
  languages = this.translate.getAvailableLangs() as LangDefinition[];

  constructor(private readonly translate: TranslocoService) {
    if (this.storedLanguage) translate.setActiveLang(this.storedLanguage);

    translate.langChanges$.subscribe((lang: string) => {
      localStorage.setItem('LT_lang', lang);
    });
  }

  setLang(lang: string) {
    this.translate.setActiveLang(lang);
  }
}
