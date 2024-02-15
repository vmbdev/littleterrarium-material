import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { PasswordService } from '@services/password.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ltm-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonModule,
    UserFormPasswordComponent,
  ],
  templateUrl: './password-reset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent {
  @ViewChild(UserFormPasswordComponent)
  private passwordComponent!: UserFormPasswordComponent;
  private token?: string | null;
  private userId?: number | null;

  protected errorInvalidToken$?: Observable<boolean>;
  protected errorInvalidPassword$ = new BehaviorSubject<boolean>(false);
  protected passwordChanged$?: Observable<any>;
  protected pwdRequirements$ = this.pws.getPasswordRequirements();

  constructor(
    private readonly route: ActivatedRoute,
    public readonly translate: TranslocoService,
    private readonly pws: PasswordService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userId = +this.route.snapshot.paramMap.get('userId')!;

    if (this.token && this.userId) {
      this.errorInvalidToken$ = this.pws
        .verifyToken(this.token, this.userId)
        .pipe(
          map((x) => false),
          catchError((e) => of(true))
        )
    } else this.errorInvalidToken$ = of(true);
  }

  submit() {
    const pwd = this.passwordComponent.form.get('password')?.value;

    if (!pwd || !this.token || !this.userId) return;

    this.passwordChanged$ = this.pws
      .recoverPassword(this.token, pwd, this.userId)
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
