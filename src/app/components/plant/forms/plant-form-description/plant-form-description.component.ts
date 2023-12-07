import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-plant-form-description',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './plant-form-description.component.html',
})
export class PlantFormDescriptionComponent implements FormBaseComponent {
  @Input() currentDescription: string | null = '';
  form = this.fb.group({ description: [''] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ description: this.currentDescription });
  }
}
