import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';
import { Light } from '@models/location.model';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'ltm-location-form-light',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatIconModule,
    TranslocoModule,
  ],
  templateUrl: './location-form-light.component.html',
})
export class LocationFormLightComponent implements FormBaseComponent {
  @Input() currentLight: Light = 'FULLSUN';
  form = this.fb.group({ light: ['FULLSUN', Validators.required] });
  lightOptions = Light;

  constructor(
    private fb: FormBuilder,
    public locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.form.patchValue({ light: this.currentLight });
  }
}
