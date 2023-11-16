import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { FormBaseComponent } from '@components/form-base/form-base.component';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'ltm-user-form-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './user-form-password.component.html',
  styleUrls: ['./user-form-password.component.scss']
})
export class UserFormPasswordComponent implements FormBaseComponent {
  @Input() currentFirstname: string | null = '';
  @Input() currentLastname: string | null = '';
  public form = this.fb.group({
    passwordCheck: this.fb.group(
      {
        password: ['', [Validators.required]],
        password2: ['', Validators.required]
      },
      {
        validators: [
          this.checkPasswordStrength.bind(this),
          this.checkPasswordsEqual
        ]
      }
    )
  });
  pwdReq: any = null;
  nonAlphaNumChars: string = '!@#$%^&*()_+-=[]{};\':"\|,.\<>/?';

  constructor (
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.api.getPasswordRequirements().subscribe((requirements: any) => {
      this.pwdReq = requirements
    });
  }

  checkPasswordStrength(group: AbstractControl): ValidationErrors | null {
    const value = group.get('password')?.value;
    const errorObj: ValidationErrors = {};

    if (this.pwdReq) {
      if (value.length < this.pwdReq.minLength) errorObj['minLength'] = true;
      if (this.pwdReq.requireUppercase && !(/.*([A-Z]).*/).test(value)) {
        errorObj['missingUppercase'] = true;
      }
      if (this.pwdReq.requireNumber && !(/.*(\d).*/).test(value)) {
        errorObj['missingNumber'] = true;
      }
      if (
        this.pwdReq.requireNonAlphanumeric
        && !(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/).test(value)
      ) {
        errorObj['missingNonAlphanumeric'] = true;
      }
    }

    return (Object.keys(errorObj).length > 0) ? errorObj : null;
  }

  checkPasswordsEqual(group: AbstractControl): ValidationErrors | null {
    const pwd1 = group.get('password')?.value;
    const pwd2 = group.get('password2')?.value;

    if (pwd1 !== pwd2) return { different: true };

    return null;
  }

  hasPasswordConditions(): boolean {
    return !!(
      this.pwdReq
      && (
        this.pwdReq.requireNumber
        || this.pwdReq.requireUppercase
        || this.pwdReq.requireNonAlphanumeric
        )
    );
  }

  hasPasswordError(control: string): boolean | undefined {
    return this.form.get('passwordCheck')?.hasError(control);
  }
  
}
