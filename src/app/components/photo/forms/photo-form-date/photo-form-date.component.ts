import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'photo-form-date',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './photo-form-date.component.html',
  styleUrls: ['./photo-form-date.component.scss']
})
export class PhotoFormDateComponent implements FormBaseComponent {
  @Input() currentTakenAt?: Date | null;
  form = this.fb.group({ takenAt: new FormControl<Date | null>(null) });
  today = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ takenAt: this.currentTakenAt })
  }
}
