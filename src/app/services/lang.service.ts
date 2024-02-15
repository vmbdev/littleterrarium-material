import { Injectable } from '@angular/core';
import { LangDefinition, TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  public current = localStorage.getItem('LT_locale');
  public readonly languages = this.translate.getAvailableLangs() as LangDefinition[];

  constructor(public readonly translate: TranslocoService) {}

  load(): void {
    if (this.current) this.setLang(this.current);

    this.translate.langChanges$.subscribe((lang: string) => {
      localStorage.setItem('LT_locale', lang);
      this.current = lang;
    });
  }

  setLang(lang: string) {
    this.translate.setActiveLang(lang);
    this.translate.load(lang).subscribe();
  }
}
