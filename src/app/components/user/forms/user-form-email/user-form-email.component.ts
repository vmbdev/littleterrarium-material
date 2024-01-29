import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-user-form-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
  ],
  templateUrl: './user-form-email.component.html',
})
export class UserFormEmailComponent implements FormBaseComponent {
  @Input() currentEmail?: string;
  @Input() errorServerInvalid: boolean = false;
  @Input() errorServerTaken: boolean = false;
  public readonly form = this.fb.group({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^\S+@\S+\.\S+$/i),
    ]),
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentEmail) this.form.patchValue({ email: this.currentEmail });
  }

  isTaken(): boolean {
    const errors = this.form.get('email')?.errors;
    return errors && errors['taken'];
  }

  isInvalid(): boolean {
    const errors = this.form.get('email')?.errors;
    return errors && errors['invalid'];
  }
}
