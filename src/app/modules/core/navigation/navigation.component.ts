import { Component, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { fromEvent, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { BottomScrollDetectorService } from '@services/bottom-scroll-detector.service';
import { TaskService } from '@services/task.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @ViewChild('content') contentElement!: ElementRef;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public auth: AuthService,
    private bottomScrollDetector: BottomScrollDetectorService,
    public taskService: TaskService
  ) {}

  // FIXME: use HostListener instead of this
  ngAfterViewInit(): void {
    if (this.contentElement) {
      const scroll$ = fromEvent<Event>(this.contentElement.nativeElement, 'scroll');
      
      scroll$.subscribe((element: Event) => {
        const target = element.target as HTMLElement;

        if (target.scrollHeight - target.scrollTop - target.clientHeight <= 1.0) {
          this.bottomScrollDetector.set();
        }
        else this.bottomScrollDetector.clear();
      });
    }
  }

  getUserLink(): string {
    if (this.auth.getUser()) return '/user';
    else return '/signin';
  }
}
