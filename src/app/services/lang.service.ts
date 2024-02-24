import { Injectable, WritableSignal, signal } from '@angular/core';
import { LangDefinition, TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  readonly #$current: WritableSignal<string | null> = signal(
    localStorage.getItem('LT_locale'),
  );
  public readonly $current = this.#$current.asReadonly();
  public readonly languages =
    this.translate.getAvailableLangs() as LangDefinition[];

  constructor(public readonly translate: TranslocoService) {}

  load(): void {
    const curr = this.#$current();
    if (curr) this.setLang(curr);

    this.translate.langChanges$.subscribe((lang: string) => {
      localStorage.setItem('LT_locale', lang);
      this.#$current.set(lang);
    });
  }

  setLang(lang: string) {
    this.translate.setActiveLang(lang);
    this.translate.load(lang).subscribe();
  }
}
