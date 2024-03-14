import { Injectable, WritableSignal, signal } from '@angular/core';

/**
 * mode avoids searching on component init
 * value = null when mode = UserInput => clear
 */
export interface SearchReceipt {
  mode: 'Begin' | 'UserInput';
  value: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  readonly #$enabled: WritableSignal<boolean> = signal(false);
  public readonly $enabled = this.#$enabled.asReadonly();
  readonly #$text: WritableSignal<SearchReceipt> = signal({
    mode: 'Begin',
    value: null,
  });
  public readonly $text = this.#$text.asReadonly();

  reset() {
    this.#$enabled.set(false);
    this.#$text.set({ mode: 'Begin', value: null });
  }

  toggle(): void {
    this.#$enabled.update((val) => !val);
  }

  setText(val: string): void {
    const prev = this.#$text();

    if (prev.value !== val) {
      this.#$text.set({ mode: 'UserInput', value: val });
    }
  }

  clear(): void {
    this.#$text.set({ mode: 'UserInput', value: null });
  }
}
