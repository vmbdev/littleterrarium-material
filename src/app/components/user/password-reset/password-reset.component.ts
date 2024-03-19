import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { PasswordService } from '@services/password/password.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

@Component({
  selector: 'ltm-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    UserFormPasswordComponent,
    LimitLargeScreenDirective,
  ],
  templateUrl: './password-reset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pws = inject(PasswordService);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.fb.group({
    password: new FormControl<string>(''),
  });
  private token?: string | null;
  private userId?: number | null;

  protected errorInvalidToken$?: Observable<boolean>;
  protected errorInvalidPassword$ = new BehaviorSubject<boolean>(false);
  protected passwordChanged$?: Observable<any>;
  protected pwdRequirements$ = this.pws.getPasswordRequirements();

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userId = +this.route.snapshot.paramMap.get('userId')!;

    if (this.token && this.userId) {
      this.errorInvalidToken$ = this.pws
        .verifyToken(this.token, this.userId)
        .pipe(
          map(() => false),
          catchError(() => of(true))
        )
    } else this.errorInvalidToken$ = of(true);
  }

  submit() {
    const { password } = this.form.value;

    if (!password || !this.form.valid || !this.token || !this.userId) return;

    this.passwordChanged$ = this.pws
      .recoverPassword(this.token, password, this.userId)
      .pipe(
        catchError((err) => {
          const msg = err.error?.msg;

          if (msg === 'USER_TOKEN_EXPIRED' || msg === 'USER_TOKEN_INVALID') {
            this.errorInvalidToken$ = of(true);
          } else if (msg === 'USER_PASSWD_INVALID') {
            this.errorInvalidPassword$.next(true);
          }

          return EMPTY;
        })
      )
  }
}
