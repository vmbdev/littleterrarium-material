import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';
import { LocationService } from '@services/location.service';
import { Location } from '@models/location.model';

@Component({
  selector: 'ltm-plant-form-location',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './plant-form-location.component.html',
})
export class PlantFormLocationComponent implements FormBaseComponent {
  @Input() currentLocation?: number;
  form = this.fb.group({
    locationId: new FormControl<number | null>(null, [Validators.required]),
  });
  locations$?: Observable<Location[]>;

  constructor(
    private fb: FormBuilder,
    public locationService: LocationService
  ) {}

  ngOnInit(): void {
    if (this.currentLocation) {
      this.form.patchValue({ locationId: this.currentLocation });
    }

    this.locations$ = this.locationService.getMany();
  }
}
