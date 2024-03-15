import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { PasswordService } from '@services/password.service';
import { CommonModule } from '@angular/common';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

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
    LimitLargeScreenDirective,
  ],
  templateUrl: './password-recovery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordRecoveryComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pws = inject(PasswordService);

  protected userForm: FormGroup = this.fb.group({
    userRef: ['', Validators.required],
  });
  protected $checkError = signal<boolean>(false);
  protected recoveryStarted$?: Observable<any>;

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
