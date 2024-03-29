import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  switchMap,
  tap,
} from 'rxjs';

import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { PasswordService } from '@services/password/password.service';
import { AuthService } from '@services/auth/auth.service';
import { User } from '@models/user.model';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

@Component({
  selector: 'ltm-password-change',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatButtonModule,
    UserFormPasswordComponent,
    LimitLargeScreenDirective,
  ],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordChangeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pws = inject(PasswordService);
  private readonly auth = inject(AuthService);

  protected readonly form = this.fb.group({
    password: new FormControl<string>(''),
  });
  protected errorInvalidPassword$ = new BehaviorSubject<boolean>(false);
  protected passwordChanged$?: Observable<any>;
  protected pwdRequirements$ = this.pws.getPasswordRequirements();

  submit() {
    const { password } = this.form.value;

    if (!this.form.valid || !password) return;

    this.passwordChanged$ = this.auth.user$.pipe(
      switchMap((user: User | null) => {
        if (user) return this.pws.changePassword(password, user.id);
        else return EMPTY;
      }),
      tap(() => {
        this.errorInvalidPassword$.next(false);
      }),
      catchError((err) => {
        if (err.error?.msg === 'USER_PASSWD_INVALID') {
          this.errorInvalidPassword$.next(true);
        }

        return EMPTY;
      }),
    );
  }
}
