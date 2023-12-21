import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-user-form-name',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
  ],
  templateUrl: './user-form-name.component.html',
})
export class UserFormNameComponent implements FormBaseComponent {
  @Input() currentFirstname?: string | null;
  @Input() currentLastname?: string | null;
  public form = this.fb.group({
    firstname: [''],
    lastname: [''],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentFirstname) {
      this.form.patchValue({ firstname: this.currentFirstname});
    }
    if (this.currentLastname) {
      this.form.patchValue({ lastname: this.currentLastname});
    }
  }
}
