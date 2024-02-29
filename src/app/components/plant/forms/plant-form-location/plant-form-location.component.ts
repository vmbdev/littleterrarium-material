import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
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
    FormBaseActionComponent,
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  templateUrl: './plant-form-location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormLocationComponent {
  protected locations$?: Observable<Location[]>;
  protected readonly locationService = inject(LocationService);

  ngOnInit(): void {
    this.locations$ = this.locationService.getMany();
  }
}
