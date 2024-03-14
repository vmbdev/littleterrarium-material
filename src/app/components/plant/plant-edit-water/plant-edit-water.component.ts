import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatBottomSheetModule,
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';

import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { FullWidthDirective } from '@directives/full-width/full-width.directive';

@Component({
  selector: 'ltm-plant-edit-water',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    TranslocoModule,
    EditPageComponent,
    FullWidthDirective,
  ],
  templateUrl: './plant-edit-water.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantEditWaterComponent {
  protected readonly waterForm = this.fb.group({
    waterFreq: new FormControl<number | null>(null),
    waterLast: new FormControl<Date | null>(null),
  });
  private id?: number;
  protected readonly today = new Date();

  constructor(
    public plantService: PlantService,
    private fb: FormBuilder,
    @Optional() private bottomSheetRef: MatBottomSheetRef
  ) {}

  ngOnInit(): void {
    const plant = this.plantService.current();

    if (plant) {
      this.id = plant.id;
      this.waterForm.patchValue({
        waterFreq: plant.waterFreq,
        waterLast: plant.waterLast,
      });
    }
  }

  submit(): void {
    if (this.id) {
      const plant = this.waterForm.value as Plant;

      plant.id = this.id;
      this.plantService.update(plant).subscribe(() => {
        if (this.bottomSheetRef) this.bottomSheetRef.dismiss();
      });
    }
  }
}
