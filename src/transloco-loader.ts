import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TranslocoLoader,
  TranslocoService,
} from '@ngneat/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export function preloadLanguage(transloco: TranslocoService) {
  return function () {
    const lang = transloco.getActiveLang();
    return transloco.load(lang);
  };
}
