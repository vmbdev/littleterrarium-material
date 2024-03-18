import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { EMPTY, catchError, finalize } from 'rxjs';

import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { AuthService } from '@services/auth.service';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

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
    LimitLargeScreenDirective,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslocoService);

  protected readonly signinForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  protected hidePassword: boolean = true;
  protected $authInvalid: WritableSignal<boolean> = signal(false);

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
    this.$authInvalid.set(false);

    this.auth
      .signIn(username, password)
      .pipe(
        finalize(() => {
          wd.close();
        }),
        catchError((err: any) => {
          if (err.msg && err.msg === 'USER_DATA_INCORRECT') {
            this.$authInvalid.set(true);
          }

          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }

  toggleHidePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
