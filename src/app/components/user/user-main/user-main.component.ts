import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';
import { MatRippleModule } from '@angular/material/core';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { MainToolbarService } from '@services/main-toolbar.service';

@Component({
  selector: 'app-user-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatRippleModule,
    MatBottomSheetModule,
    TranslateModule,
    ProfileComponent,
  ],
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
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
