import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { BreadcrumbLink } from '@models/breadcrumb-link.model';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  links$: BehaviorSubject<BreadcrumbLink[]> = new BehaviorSubject<BreadcrumbLink[]>([]);
  prev: BreadcrumbLink[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.prev = this.links$.getValue();
      this.links$.next([]);
    })
  }

  setNavigation(links: any[], options: any = {}): void {
    if (options.attachTo) {
      const newLinks = [];
      let found = false;
      let i = 0;

      while ((i < this.prev.length) && !found) {
        // if there's already an id with the one inserting, stop searching and attach there
        if (this.prev[i].selector === links[0].selector) found = true;
        else {
          newLinks.push(this.prev[i]);

          if (this.prev[i].selector === options.attachTo) found = true;
        }

        i++;
      }
      
      this.links$.next(newLinks.concat([...links]));
    }
    else this.links$.next(links);
  }

}
