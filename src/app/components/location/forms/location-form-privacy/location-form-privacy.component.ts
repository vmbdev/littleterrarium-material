import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Location } from '@models/location.model';

@Component({
  selector: 'location-form-privacy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TranslateModule
  ],
  templateUrl: './location-form-privacy.component.html',
  styleUrls: ['./location-form-privacy.component.scss']
})
export class LocationFormPrivacyComponent {
  @Input() location?: Location | null;
  form = this.fb.group({ public: [true] });

  constructor(private fb: FormBuilder) {}
}
