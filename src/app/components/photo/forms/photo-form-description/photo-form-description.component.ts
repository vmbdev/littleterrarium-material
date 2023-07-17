import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'photo-form-description',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './photo-form-description.component.html',
  styleUrls: ['./photo-form-description.component.scss']
})
export class PhotoFormDescriptionComponent implements FormBaseComponent {
  @Input() currentDescription: string | null = '';
  form = this.fb.group({ description: [''] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ description: this.currentDescription })
  }
}
