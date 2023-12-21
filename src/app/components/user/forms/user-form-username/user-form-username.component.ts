import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-user-form-username',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
  ],
  templateUrl: './user-form-username.component.html',
})
export class UserFormUsernameComponent implements FormBaseComponent {
  @Input() currentUsername?: string;
  public form = this.fb.group({ username: ['', Validators.required] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentUsername) {
      this.form.patchValue({ username: this.currentUsername });
    }
  }

  isTaken(): boolean {
    const errors = this.form.get('username')?.errors;
    return errors && errors['taken'];
  }

  isInvalid(): boolean {
    const errors = this.form.get('username')?.errors;
    return errors && errors['invalid'];
  }
}
