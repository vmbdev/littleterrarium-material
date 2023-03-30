import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { LocationService } from '@services/location.service';
import { Light, Location } from '@models/location.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'location-form-light',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './location-form-light.component.html',
  styleUrls: ['./location-form-light.component.scss']
})
export class LocationFormLightComponent {
  @Input() location?: Location;
  form = this.fb.group({ light: ['FULLSUN', Validators.required] });
  lightOptions = Light;

  constructor(
    private fb: FormBuilder,
    public locationService: LocationService
  ) {}
  
}
