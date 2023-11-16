import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

/**
 * mode avoids searching on component init
 * value = null when mode = UserInput => clear
 */
export interface SearchReceipt {
  mode: 'Begin' | 'UserInput',
  value: string | null
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  enabled$ = new BehaviorSubject<boolean>(true);
  text$ = new BehaviorSubject<SearchReceipt>({ mode: 'Begin', value: null });

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd =>
        event instanceof NavigationEnd
      )
    ).subscribe(() => {
      this.enabled$.next(false);
      this.text$.next( { mode: 'Begin', value: null })
    })
  }

  enable(val: boolean) {
    this.enabled$.next(val);
  }

  toggle(): void {
    const val = this.enabled$.getValue();
    this.enabled$.next(!val);
  }

  setText(val: string): void {
    const prev = this.text$.getValue();

    if (prev.value != val) {
      this.text$.next({ mode: 'UserInput', value: val});
    }
  }

  clear(): void {
    this.text$.next({ mode: 'UserInput', value: null });
  }
}
