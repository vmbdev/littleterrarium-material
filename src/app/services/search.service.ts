import { Injectable, WritableSignal, signal } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
      )
      .subscribe(() => {
        this.#$enabled.set(false);
        this.#$text.set({ mode: 'Begin', value: null });
      });
  }

  enable(val: boolean) {
    this.#$enabled.set(val);
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
