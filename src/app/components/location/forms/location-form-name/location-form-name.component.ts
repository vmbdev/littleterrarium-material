import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-location-form-name',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
  ],
  templateUrl: './location-form-name.component.html',
})
export class LocationFormNameComponent implements FormBaseComponent {
  @Input() currentName?: string;
  public form = this.fb.group({ name: ['', Validators.required] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentName) this.form.patchValue({ name: this.currentName });
  }
}
