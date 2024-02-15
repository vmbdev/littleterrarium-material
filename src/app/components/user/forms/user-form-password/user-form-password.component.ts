import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';
import { ApiService } from '@services/api.service';
import { PasswordRequirements } from '@models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  templateUrl: './user-form-password.component.html',
  styleUrls: ['./user-form-password.component.scss'],
})
export class UserFormPasswordComponent implements FormBaseComponent {
  @Input() requirements?: PasswordRequirements | null;
  public readonly form = this.fb.group(
    {
      password: ['', [Validators.required]],
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
  ) {}

  // ngOnInit(): void {
  //   this.api.getPasswordRequirements().subscribe((requirements: any) => {
  //     this.pwdReq = requirements;
  //   });
  // }

  checkPasswordStrength(group: AbstractControl): ValidationErrors | null {
    const value = group.get('password')?.value;
    const errorObj: ValidationErrors = {};

    if (this.requirements) {
      if (value.length < this.requirements.minLength) {
        errorObj['minLength'] = true;
      }
      if (this.requirements.requireUppercase && !/.*([A-Z]).*/.test(value)) {
        errorObj['missingUppercase'] = true;
      }
      if (this.requirements.requireNumber && !/.*(\d).*/.test(value)) {
        errorObj['missingNumber'] = true;
      }
      if (
        this.requirements.requireNonAlphanumeric &&
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
