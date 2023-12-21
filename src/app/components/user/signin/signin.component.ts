import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { finalize } from 'rxjs';

import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'ltm-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslocoModule,
    WaitDialogComponent,
  ],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  signinForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  hidePassword: boolean = true;
  authInvalid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslocoService
  ) {}

  ngOnInit(): void {
    this.auth.signedIn$.subscribe((val: boolean) => {
      if (val) this.router.navigateByUrl('/');
    });
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.translate('signin.progress'),
        progressBar: false,
      },
    });
  }

  submit() {
    if (!this.signinForm.valid) return;

    const { username, password } = this.signinForm.value;
    const wd = this.openWaitDialog();
    this.authInvalid = false;

    this.auth
      .signIn(username, password)
      .pipe(
        finalize(() => {
          wd.close();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err: any) => {
          if (err.msg && err.msg === 'USER_DATA_INCORRECT') {
            this.authInvalid = true;
          }
        },
      });
  }

  toggleHidePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
