import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-form-privacy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TranslocoModule,
  ],
  templateUrl: './form-privacy.component.html',
})
export class FormPrivacyComponent implements FormBaseComponent {
  @Input() currentPrivacy: boolean = true;
  public readonly form = this.fb.group({ public: [true] });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ public: this.currentPrivacy });
  }
}
