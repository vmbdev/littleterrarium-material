import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { catchError, EMPTY } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { AuthService } from '@services/auth.service';

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
  userForm: FormGroup;
  checkError: boolean = false;
  recoveryStarted: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {
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
      this.auth
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
