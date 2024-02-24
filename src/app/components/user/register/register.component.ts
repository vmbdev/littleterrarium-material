import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '@services/auth.service';
import { TranslocoModule } from '@ngneat/transloco';
import { HttpErrorResponse } from '@angular/common/http';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { catchError, EMPTY, switchMap } from 'rxjs';

import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { UserFormUsernameComponent } from '@components/user/forms/user-form-username/user-form-username.component';
import { UserFormEmailComponent } from '@components/user/forms/user-form-email/user-form-email.component';
import { User } from '@models/user.model';
import { PasswordService } from '@services/password.service';

@Component({
  selector: 'ltm-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    TranslocoModule,
    StepperNavigationComponent,
    UserFormPasswordComponent,
    UserFormUsernameComponent,
    UserFormEmailComponent,
  ],
  templateUrl: './register.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  @ViewChild(UserFormPasswordComponent)
  passwordComponent!: UserFormPasswordComponent;
  @ViewChild(UserFormUsernameComponent)
  usernameComponent!: UserFormUsernameComponent;
  @ViewChild(UserFormEmailComponent) emailComponent!: UserFormEmailComponent;

  protected $stepperIndex: WritableSignal<number | null> = signal(null);
  protected pwdRequirements$ = this.pws.getPasswordRequirements();

  constructor(
    public readonly auth: AuthService,
    private readonly router: Router,
    private readonly pws: PasswordService,
  ) {}

  checkFormValidity(): boolean {
    const forms = [
      this.passwordComponent.form,
      this.emailComponent.form,
      this.usernameComponent.form,
    ];

    return forms.every((form) => form.valid);
  }

  getUserFromForm(): User {
    return {
      ...this.emailComponent.form.value,
      ...this.usernameComponent.form.value,
      password: this.passwordComponent.form.get('password')?.value,
    } as User;
  }

  stepperMoveTo(i: number): void {
    // trigger an Input() detection
    this.$stepperIndex.set(null);
    this.$stepperIndex.set(i);
  }

  submit(): void {
    if (!this.checkFormValidity()) return;

    const user = this.getUserFromForm();

    this.pws
      .checkPassword(user.password)
      .pipe(
        switchMap(() => {
          return this.auth.register(user);
        }),
        catchError((err: HttpErrorResponse) => {
          const error = err.error;

          if (error.msg === 'USER_FIELD_EXISTS') {
            if (error.errorData.field === 'username') {
              this.usernameComponent.form
                .get('username')
                ?.setErrors({ taken: true });

              this.stepperMoveTo(0);
            } else if (error.errorData.field === 'email') {
              this.emailComponent.form.get('email')?.setErrors({ taken: true });

              this.stepperMoveTo(1);
            }
          } else if (error.msg === 'USER_FIELD_INVALID') {
            if (error.errorData.field === 'username') {
              this.usernameComponent.form
                .get('username')
                ?.setErrors({ invalid: true });

              this.stepperMoveTo(0);
            } else if (error.errorData.field === 'email') {
              this.emailComponent.form
                .get('email')
                ?.setErrors({ invalid: true });

              this.stepperMoveTo(1);
            }
          }

          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }
}
