import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-plant-form-name',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
  ],
  templateUrl: './plant-form-name.component.html',
})
export class PlantFormNameComponent implements FormBaseComponent {
  @Input() currentCustomName?: string | null;
  public readonly form = this.fb.group({ customName: [''] });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentCustomName) {
      this.form.patchValue({ customName: this.currentCustomName });
    }
  }
}
