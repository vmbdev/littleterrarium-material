import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'user-form-privacy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCheckboxModule
  ],
  templateUrl: './user-form-privacy.component.html',
  styleUrls: ['./user-form-privacy.component.scss']
})
export class UserFormPrivacyComponent implements FormBaseComponent {
  @Input() currentPrivacy: boolean = true;
  form = this.fb.group({ public: [true] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ public: this.currentPrivacy })
  }
}
