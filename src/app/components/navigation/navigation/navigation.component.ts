import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { fromEvent, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import {
  BottomToolbarComponent
} from '@components/navigation/bottom-toolbar/bottom-toolbar.component';
import {
  LangSwitcherComponent
} from '@components/navigation/lang-switcher/lang-switcher.component';
import {
  MainToolbarComponent
} from '@components/navigation/main-toolbar/main-toolbar.component';
import {
  SearchComponent
} from '@components/navigation/search/search.component';
import {
  UserBoxComponent
} from '@components/navigation/user-box/user-box.component';
import { AuthService } from '@services/auth.service';
import {
  BottomScrollDetectorService
} from '@services/bottom-scroll-detector.service';
import { TaskService } from '@services/task.service';
import { ThemeService } from '@services/theme.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

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
    TranslateModule,
    BottomToolbarComponent,
    LangSwitcherComponent,
    ThemeSwitcherComponent,
    MainToolbarComponent,
    SearchComponent,
    UserBoxComponent,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @ViewChild('content') contentElement!: ElementRef;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public auth: AuthService,
    private bottomScrollDetector: BottomScrollDetectorService,
    public taskService: TaskService,
    public readonly themeService: ThemeService
  ) {}

  // FIXME: use HostListener instead of this
  ngAfterViewInit(): void {
    if (this.contentElement) {
      const scroll$ = fromEvent<Event>(
        this.contentElement.nativeElement,
        'scroll'
      );

      scroll$.subscribe((element: Event) => {
        const target = element.target as HTMLElement;
        const gotBottom =
          target.scrollHeight - target.scrollTop - target.clientHeight;

        if (gotBottom <= 1.0) {
          this.bottomScrollDetector.set();
        } else this.bottomScrollDetector.clear();
      });
    }
  }

  getUserLink(): string {
    if (this.auth.getUser()) return '/user';
    else return '/signin';
  }
}
