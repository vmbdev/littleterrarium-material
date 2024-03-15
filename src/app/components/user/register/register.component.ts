import {
  ChangeDetectionStrategy,
  Component,
  ModelSignal,
  inject,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { PasswordService } from '@services/password.service';
import { User } from '@models/user.model';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

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
    LimitLargeScreenDirective,
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
  private readonly fb = inject(FormBuilder);
  private readonly pws = inject(PasswordService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly usernameForm = this.fb.group({
    username: new FormControl<string>('', Validators.required),
  });
  protected readonly emailForm = this.fb.group({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^\S+@\S+\.\S+$/i),
    ]),
  });
  protected readonly passwordForm = this.fb.group({
    password: new FormControl<string>('', Validators.required),
  });
  protected readonly form = this.fb.group({
    username: this.usernameForm,
    email: this.emailForm,
    password: this.passwordForm,
  });

  protected $stepperIndex: ModelSignal<number> = model(0);
  protected pwdRequirements$ = this.pws.getPasswordRequirements();

  setStep(index: number) {
    this.$stepperIndex.set(index);
  }

  submit(): void {
    if (!this.form.valid) return;

    const user = {
      ...this.usernameForm.value,
      ...this.emailForm.value,
      ...this.passwordForm.value,
    } as User;

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
              this.usernameForm.get('username')?.setErrors({ taken: true });
              this.setStep(0);
            } else if (error.errorData.field === 'email') {
              this.emailForm.get('email')?.setErrors({ taken: true });
              this.setStep(1);
            }
          } else if (error.msg === 'USER_FIELD_INVALID') {
            if (error.errorData.field === 'username') {
              this.usernameForm.get('username')?.setErrors({ invalid: true });
              this.setStep(0);
            } else if (error.errorData.field === 'email') {
              this.emailForm.get('email')?.setErrors({ invalid: true });
              this.setStep(1);
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
