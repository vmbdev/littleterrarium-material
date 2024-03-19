import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
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
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, map, shareReplay } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { BottomToolbarComponent } from '@components/navigation/bottom-toolbar/bottom-toolbar.component';
import { MainToolbarComponent } from '@components/navigation/main-toolbar/main-toolbar.component';
import { SearchComponent } from '@components/navigation/search/search.component';
import { UserBoxComponent } from '@components/navigation/user-box/user-box.component';
import { AuthService } from '@services/auth/auth.service';
import { TaskService } from '@services/task/task.service';
import { ThemeService } from '@services/theme/theme.service';
import { BottomScrollDirective } from '@directives/bottom-scroll/bottom-scroll.directive';
import {
  ScrollDetectorDirective,
  ScrollDirection,
} from '@directives/scroll-detector/scroll-detector.directive';

@Component({
  selector: 'ltm-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatDividerModule,
    MatSidenavModule,
    TranslocoModule,
    BottomToolbarComponent,
    MainToolbarComponent,
    SearchComponent,
    UserBoxComponent,
    BottomScrollDirective,
    ScrollDetectorDirective,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly auth = inject(AuthService);
  protected readonly taskService = inject(TaskService);
  protected readonly themeService = inject(ThemeService);

  private sidenav = viewChild<MatSidenav>('drawer');

  protected isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  protected isLargeScreen$ = this.breakpointObserver
    .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  protected $hideToolbars = signal(false);

  toggleNav() {
    this.sidenav()?.toggle();
  }

  scrolled(direction: ScrollDirection) {
    if (direction === 'Up') this.$hideToolbars.set(false);
    else this.$hideToolbars.set(true);
  }
}
