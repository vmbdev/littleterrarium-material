import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { TranslocoModule } from '@ngneat/transloco';

import {
  UserEditComponent
} from '@components/user/user-edit/user-edit.component';
import { ProfileComponent } from '@components/user/profile/profile.component';
import { MainToolbarService } from '@services/main-toolbar.service';
import { AuthService } from '@services/auth.service';

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
    TranslocoModule,
    ProfileComponent,
  ],
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss'],
})
export class UserMainComponent {
  constructor(
    public auth: AuthService,
    private mt: MainToolbarService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.mt.hide();
  }

  openEdit(): void {
    this.bottomSheet.open(UserEditComponent);
  }
}
