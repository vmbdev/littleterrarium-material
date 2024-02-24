import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { fromEvent, Observable, map, shareReplay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@ngneat/transloco';

import { BottomToolbarComponent } from '@components/navigation/bottom-toolbar/bottom-toolbar.component';
import { LangSwitcherComponent } from '@components/navigation/lang-switcher/lang-switcher.component';
import { MainToolbarComponent } from '@components/navigation/main-toolbar/main-toolbar.component';
import { SearchComponent } from '@components/navigation/search/search.component';
import { UserBoxComponent } from '@components/navigation/user-box/user-box.component';
import { ThemeSwitcherComponent } from '@components/navigation/theme-switcher/theme-switcher.component';
import { AuthService } from '@services/auth.service';
import { BottomScrollDetectorService } from '@services/bottom-scroll-detector.service';
import { TaskService } from '@services/task.service';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'ltm-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatDividerModule,
    MatSidenavModule,
    TranslocoModule,
    BottomToolbarComponent,
    LangSwitcherComponent,
    ThemeSwitcherComponent,
    MainToolbarComponent,
    SearchComponent,
    UserBoxComponent,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  @ViewChild('content') contentElement!: ElementRef;
  protected isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    protected readonly auth: AuthService,
    private readonly bottomScrollDetector: BottomScrollDetectorService,
    protected readonly taskService: TaskService,
    protected readonly themeService: ThemeService,
  ) {}

  // FIXME: use HostListener instead of this
  ngAfterViewInit(): void {
    if (this.contentElement) {
      fromEvent<Event>(this.contentElement.nativeElement, 'scrollend')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((element: Event) => {
          const target = element.target as HTMLElement;
          const gotBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight;

          if (gotBottom <= 1.0) {
            this.bottomScrollDetector.set();
          } else this.bottomScrollDetector.clear();
        });
    }
  }
}
