import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs';


@Component({
  selector: 'logout',
  standalone: true,
  imports: [
    CommonModule,
    WaitDialogComponent,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    const wd = this.openWaitDialog();

    this.auth.logOut().pipe(
      finalize(() => { wd.close() } )
    ).subscribe({
      complete: () => { this.router.navigate(['/']) }
    });
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.instant('user-logout.msg'),
        progressBar: false,
      },
    });
  }
}
