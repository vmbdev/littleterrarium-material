import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LocationService } from '@services/location.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { Location } from '@models/location.model';
import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'plant-form-location',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './plant-form-location.component.html',
  styleUrls: ['./plant-form-location.component.scss']
})
export class PlantFormLocationComponent implements FormBaseComponent {
  @Input() currentLocation?: number;
  form = this.fb.group({
    locationId: new FormControl<number | null>(null, [ Validators.required ])
  });
  locations$?: Observable<Location[]>;

  constructor(
    private fb: FormBuilder,
    public locationService: LocationService
  ) {}

  ngOnInit(): void {
    if (this.currentLocation) this.form.patchValue({ locationId: this.currentLocation });

    this.locations$ = this.locationService.getMany();

  }
}
