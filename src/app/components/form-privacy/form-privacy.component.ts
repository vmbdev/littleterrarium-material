import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormBaseComponent } from '@components/form-base/form-base.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ltm-form-privacy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './form-privacy.component.html',
})
export class FormPrivacyComponent implements FormBaseComponent {
  @Input() currentPrivacy: boolean = true;
  form = this.fb.group({ public: [true] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ public: this.currentPrivacy });
  }
}
