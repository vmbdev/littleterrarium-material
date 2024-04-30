import { inject, Injectable, signal } from '@angular/core';
import { take, tap, switchMap } from 'rxjs';
import { LangDefinition, TranslocoService } from '@ngneat/transloco';

import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslocoService);
  private readonly auth = inject(AuthService);

  #$current = signal(this.translate.getActiveLang());
  $current = this.#$current.asReadonly();
  $list = signal(
    this.translate.getAvailableLangs() as LangDefinition[],
  ).asReadonly();

  init() {
    const storedLocale = this.auth.getPref('locale');

    if (storedLocale) this.setLang(storedLocale);
  }

  setLang(lang: string) {
    const availableLocales = this.$list().map((lang) => lang.id);

    if (availableLocales.includes(lang)) {
      this.translate
        .load(lang)
        .pipe(
          take(1),
          tap(() => {
            this.#$current.set(lang);
            this.translate.setActiveLang(lang);
          }),
          switchMap(() => this.auth.setPref({ locale: lang })),
        )
        .subscribe();
    }
  }
}
