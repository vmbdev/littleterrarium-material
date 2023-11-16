import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-photo-form-description',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './photo-form-description.component.html'
})
export class PhotoFormDescriptionComponent implements FormBaseComponent {
  @Input() currentDescription: string | null = '';
  form = this.fb.group({ description: [''] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ description: this.currentDescription })
  }
}
