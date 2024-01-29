import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';
import { Light } from '@models/location.model';
import { LocationService } from '@services/location.service';

type LightOptionType = {
  value: string;
  asset: string;
};

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
  @Input() currentLight: string = 'FULLSUN';
  public readonly form = this.fb.group({
    light: ['FULLSUN', Validators.required],
  });
  protected lightOptions: LightOptionType[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public readonly locationService: LocationService,
  ) {}

  ngOnInit(): void {
    this.lightOptions = this.createLightOptions();
    this.form.patchValue({ light: this.currentLight });
  }

  createLightOptions(): LightOptionType[] {
    const opts: LightOptionType[] = [];

    for (const option of Object.keys(Light)) {
      opts.push({
        value: option,
        asset: this.locationService.getLightAsset(option),
      });
    }

    return opts;
  }
}
