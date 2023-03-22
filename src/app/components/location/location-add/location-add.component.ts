import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'location-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
  ],
  templateUrl: './location-add.component.html',
  styleUrls: ['./location-add.component.scss']
})
export class LocationAddComponent {
  form = this.fb.group({
    formArray: this.fb.array([
      this.fb.group({ name: ['', Validators.required] }),
      this.fb.group({ picture: [] }),
      this.fb.group({ light: ['FULLSUN', Validators.required] }),
      this.fb.group({ public: [true] })
    ])
  })

  constructor(
    private fb: FormBuilder,
  ) {}

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  fileInputChange(event: Event): void {
  }
}
