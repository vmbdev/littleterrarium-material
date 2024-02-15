import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';

import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { PasswordService } from '@services/password.service';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';

@Component({
  selector: 'ltm-password-change',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonModule,
    UserFormPasswordComponent,
  ],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordChangeComponent {
  @ViewChild(UserFormPasswordComponent)
  private passwordComponent!: UserFormPasswordComponent;

  protected errorInvalidPassword$ = new BehaviorSubject<boolean>(false);
  protected passwordChanged$?: Observable<any>;
  protected pwdRequirements$ = this.pws.getPasswordRequirements();

  constructor(
    public readonly translate: TranslocoService,
    private readonly pws: PasswordService,
    private readonly auth: AuthService,
  ) {}

  submit() {
    const pwd = this.passwordComponent.form.get('password')?.value;

    if (!pwd) return;

    this.passwordChanged$ = this.auth.user$.pipe(
      switchMap((user: User | null) => {
        if (user) return this.pws.changePassword(pwd, user.id);
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
