import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { catchError, EMPTY } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { PasswordService } from '@services/password.service';

@Component({
  selector: 'ltm-password-recovery',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    TranslocoModule,
  ],
  templateUrl: './password-recovery.component.html',
})
export class PasswordRecoveryComponent {
  protected userForm: FormGroup;
  protected checkError: boolean = false;
  protected recoveryStarted: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pwd: PasswordService
  ) {
    this.userForm = this.fb.group({
      userRef: ['', Validators.required],
    });
  }

  submit() {
    this.checkError = false;
    this.recoveryStarted = false;

    if (!this.userForm.valid) return;

    const { userRef } = this.userForm.value;

    if (userRef) {
      this.pwd
        .forgotPassword(userRef)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.checkError = true;

            return EMPTY;
          })
        )
        .subscribe(() => {
          this.recoveryStarted = true;
        });
    }
  }
}
