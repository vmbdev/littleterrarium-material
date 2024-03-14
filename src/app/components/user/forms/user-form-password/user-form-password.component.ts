import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  forwardRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { PasswordRequirements } from '@models/user.model';
import { FullWidthDirective } from '@directives/full-width/full-width.directive';

@Component({
  selector: 'ltm-user-form-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    FullWidthDirective,
  ],
  templateUrl: './user-form-password.component.html',
  styleUrls: ['./user-form-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserFormPasswordComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: UserFormPasswordComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormPasswordComponent implements ControlValueAccessor {
  private readonly fb = inject(FormBuilder);
  private readonly renderer = inject(Renderer2);

  requirements = input<PasswordRequirements | null>();
  private readonly pwdEl = viewChild<ElementRef>('password');

  public readonly form = this.fb.group(
    {
      password: ['', Validators.required],
      password2: ['', Validators.required],
    },
    {
      validators: [
        this.checkPasswordStrength.bind(this),
        this.checkPasswordsEqual,
      ],
    },
  );

  protected hidePassword: boolean = true;
  protected hidePassword2: boolean = true;
  protected nonAlphaNumChars: string = '!@#$%^&*()_+-=[]{};\':"|,.<>/?';

  private onChange = (val: string) => {};
  private onTouched = () => {};

  writeValue(val: string): void {
    this.renderer.setProperty(this.pwdEl()?.nativeElement, 'value', val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  change(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onChange(target.value);
  }

  changeSecondInput(pwdInput: HTMLInputElement) {
    this.onChange(pwdInput.value);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.pwdEl()?.nativeElement,
      'disabled',
      isDisabled,
    );
  }

  validate() {
    return {
      ...this.form.errors,
      ...this.form.get('password')?.errors,
      ...this.form.get('password2')?.errors,
    };
  }

  checkPasswordStrength(group: AbstractControl): ValidationErrors | null {
    const value = group.get('password')?.value;
    const errorObj: ValidationErrors = {};
    const reqs = this.requirements();

    if (reqs) {
      if (value.length < reqs.minLength) {
        errorObj['minLength'] = true;
      }
      if (reqs.requireUppercase && !/.*([A-Z]).*/.test(value)) {
        errorObj['missingUppercase'] = true;
      }
      if (reqs.requireNumber && !/.*(\d).*/.test(value)) {
        errorObj['missingNumber'] = true;
      }
      if (
        reqs.requireNonAlphanumeric &&
        !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)
      ) {
        errorObj['missingNonAlphanumeric'] = true;
      }
    }

    return Object.keys(errorObj).length > 0 ? errorObj : null;
  }

  checkPasswordsEqual(group: AbstractControl): ValidationErrors | null {
    const pwd1 = group.get('password')?.value;
    const pwd2 = group.get('password2')?.value;

    if (pwd1 !== pwd2) return { different: true };

    return null;
  }

  hasPasswordError(control: string): boolean | undefined {
    return this.form.hasError(control);
  }

  toggleHidePassword(field: number = 1): void {
    if (field === 1) this.hidePassword = !this.hidePassword;
    else if (field === 2) this.hidePassword2 = !this.hidePassword2;
  }
}
