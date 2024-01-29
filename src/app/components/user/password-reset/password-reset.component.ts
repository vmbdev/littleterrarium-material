import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { catchError, EMPTY } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { PasswordService } from '@services/password.service';

@Component({
  selector: 'ltm-password-reset',
  standalone: true,
  imports: [TranslocoModule, MatButtonModule, UserFormPasswordComponent],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {
  @ViewChild(UserFormPasswordComponent)
  private passwordComponent!: UserFormPasswordComponent;
  private token?: string | null;
  private userId?: number | null;

  protected errorInvalidToken: boolean = false;
  protected errorInvalidPassword: boolean = false;
  protected passwordChanged: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    public readonly translate: TranslocoService,
    private readonly pwd: PasswordService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userId = +this.route.snapshot.paramMap.get('userId')!;

    if (this.token && this.userId) {
      this.pwd
        .verifyToken(this.token, this.userId)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.errorInvalidToken = true;

            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  submit() {
    const pwd = this.passwordComponent.form.get('password')?.value;

    if (!pwd || !this.token || !this.userId) return;

    this.pwd
      .recoverPassword(this.token, pwd, this.userId)
      .pipe(
        catchError((err) => {
          const msg = err.error?.msg;

          if (msg === 'USER_TOKEN_EXPIRED' || msg === 'USER_TOKEN_INVALID') {
            this.errorInvalidToken = true;
          } else if (msg === 'USER_PASSWD_INVALID') {
            this.errorInvalidPassword = true;
          }

          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.passwordChanged = true;
      });
  }
}
