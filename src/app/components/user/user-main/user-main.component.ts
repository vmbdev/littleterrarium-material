import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { TranslocoModule } from '@ngneat/transloco';

import { UserEditComponent } from '@components/user/user-edit/user-edit.component';
import { ProfileComponent } from '@components/user/profile/profile.component';
import { LangSwitcherComponent } from '@components/lang-switcher/lang-switcher.component';
import { ThemeSwitcherComponent } from '@components/theme-switcher/theme-switcher.component';
import { MainToolbarService } from '@services/main-toolbar.service';
import { AuthService } from '@services/auth.service';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

@Component({
  selector: 'ltm-user-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatIconModule,
    MatDividerModule,
    TranslocoModule,
    ProfileComponent,
    LangSwitcherComponent,
    ThemeSwitcherComponent,
    LimitLargeScreenDirective,
  ],
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMainComponent {
  protected readonly auth = inject(AuthService);
  private readonly mt = inject(MainToolbarService);
  private readonly bottomSheet = inject(MatBottomSheet);

  ngOnInit(): void {
    this.mt.hide();
  }

  openEdit(): void {
    this.bottomSheet.open(UserEditComponent);
  }
}
