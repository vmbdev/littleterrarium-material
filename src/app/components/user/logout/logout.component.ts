import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'ltm-logout',
  standalone: true,
  imports: [
    CommonModule,
    WaitDialogComponent,
    TranslocoModule,
    MatDialogModule,
  ],
  templateUrl: './logout.component.html',
})
export class LogoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslocoService
  ) {}

  ngOnInit(): void {
    const wd = this.openWaitDialog();

    this.auth
      .logOut()
      .pipe(
        finalize(() => {
          wd.close();
        })
      )
      .subscribe({
        complete: () => {
          this.router.navigate(['/']);
        },
      });
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.translate('user-logout.msg'),
        progressBar: false,
      },
    });
  }
}
