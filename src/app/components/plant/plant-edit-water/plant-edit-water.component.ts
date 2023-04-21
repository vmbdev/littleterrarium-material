import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'plant-edit-water',
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
    TranslateModule
  ],
  templateUrl: './plant-edit-water.component.html',
  styleUrls: ['./plant-edit-water.component.scss']
})
export class PlantEditWaterComponent {
  waterForm = this.fb.group({
    waterFreq: new FormControl<number | null>(null),
    waterLast: new FormControl<Date | null>(null),
  });
  id?: number;
  today = new Date();

  constructor(
    public plantService: PlantService,
    private fb: FormBuilder,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
  ) {}

  ngOnInit(): void {
    // TODO: shall it get a new one, or use the current one?
    const plant = this.plantService.plant$.getValue();

    if (plant) {
      this.id = plant.id;
      this.waterForm.patchValue({
        waterFreq: plant.waterFreq,
        waterLast: plant.waterLast
      })
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
