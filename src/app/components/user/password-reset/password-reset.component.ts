import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { catchError, EMPTY } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  UserFormPasswordComponent
} from '@components/user/forms/user-form-password/user-form-password.component';
import { AuthService } from '@services/auth.service';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'ltm-password-reset',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, UserFormPasswordComponent],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {
  @ViewChild(UserFormPasswordComponent)
  passwordComponent!: UserFormPasswordComponent;
  token?: string | null;
  userId?: number | null;

  errorInvalidToken: boolean = false;
  errorInvalidPassword: boolean = false;
  passwordChanged: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userId = +this.route.snapshot.paramMap.get('userId')!;

    if (this.token && this.userId) {
      this.api
        .verifyToken(this.token, this.userId)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.errorInvalidToken = true;

            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  submit() {
    const pwd = this.passwordComponent.form.get('password')?.value;

    if (!pwd || !this.token || !this.userId) return;

    this.auth
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
        })
      )
      .subscribe(() => {
        this.passwordChanged = true;
      });
  }
}
