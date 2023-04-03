import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plant } from '@models/plant.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'plant-form-privacy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TranslateModule
  ],
  templateUrl: './plant-form-privacy.component.html',
  styleUrls: ['./plant-form-privacy.component.scss']
})
export class PlantFormPrivacyComponent {
  @Input() plant?: Plant;
  form = this.fb.group({ public: [true] });

  constructor(private fb: FormBuilder) {}
}
