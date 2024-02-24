import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-photo-form-description',
  standalone: true,
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './photo-form-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormDescriptionComponent implements FormBaseComponent {
  @Input() currentDescription?: string | null;
  public readonly form = this.fb.group({ description: [''] });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentDescription) {
      this.form.patchValue({ description: this.currentDescription });
    }
  }
}
