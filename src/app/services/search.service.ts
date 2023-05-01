import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  enabled$ = new BehaviorSubject<boolean>(true);
  text$ = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.enabled$.next(false);
      this.text$.next('');
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

    if (prev != val) this.text$.next(val);
  }

  clear(): void {
    this.text$.next('');
  }
}
