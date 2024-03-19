import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { LocationService } from '@services/location/location.service';

@Component({
  selector: 'ltm-plant-form-location',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatSelectModule,
    FormBaseActionComponent,
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  templateUrl: './plant-form-location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormLocationComponent {
  protected readonly locationService = inject(LocationService);

  protected readonly locations$ = this.locationService.getMany();
}
