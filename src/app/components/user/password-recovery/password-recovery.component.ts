import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { PasswordService } from '@services/password.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ltm-password-recovery',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    TranslocoModule,
  ],
  templateUrl: './password-recovery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordRecoveryComponent {
  protected userForm: FormGroup;
  protected $checkError = signal<boolean>(false);
  protected recoveryStarted$?: Observable<any>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pws: PasswordService
  ) {
    this.userForm = this.fb.group({
      userRef: ['', Validators.required],
    });
  }

  submit() {
    if (!this.userForm.valid) return;

    const { userRef } = this.userForm.value;

    if (userRef) {
      this.recoveryStarted$ = this.pws
        .forgotPassword(userRef)
        .pipe(
          tap(() => { this.$checkError.set(false) }),
          catchError(() => {
            this.$checkError.set(true);

            return EMPTY;
          })
        )
    }
  }
}
