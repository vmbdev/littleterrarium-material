import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-plant-form-description',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './plant-form-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormDescriptionComponent implements FormBaseComponent {
  @Input() currentDescription?: string | null;
  public readonly form = this.fb.group({ description: [''] });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentDescription) {
      this.form.patchValue({ description: this.currentDescription });
    }
  }
}
