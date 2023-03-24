import { Component } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lang-switcher',
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss']
})
export class LangSwitcherComponent {
  storedLanguage = localStorage.getItem('LT_lang');
  languages = [
    { value: 'en', name: 'English' },
    { value: 'es', name: 'Español' },
  ]

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');

    if (this.storedLanguage) translate.use(this.storedLanguage);

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem('LT_lang', event.lang);
    });
  }

  setLang(lang: string) {
    this.translate.use(lang);
  }
}
