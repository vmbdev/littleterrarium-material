import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-photo-form-date',
  standalone: true,
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './photo-form-date.component.html',
})
export class PhotoFormDateComponent implements FormBaseComponent {
  @Input() currentTakenAt?: Date | null;
  form = this.fb.group({ takenAt: new FormControl<Date | null>(null) });
  today = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentTakenAt) {
      this.form.patchValue({ takenAt: this.currentTakenAt });
    }
  }
}
