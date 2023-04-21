import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Plant } from '@models/plant.model';
import { PlantService } from '@services/plant.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-plant-edit-fertilizer',
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
  templateUrl: './plant-edit-fertilizer.component.html',
  styleUrls: ['./plant-edit-fertilizer.component.scss']
})
export class PlantEditFertilizerComponent {
  fertForm = this.fb.group({
    fertFreq: new FormControl<number | null>(null),
    fertLast: new FormControl<Date | null>(null),
    fertType: new FormControl<string | null>(null)
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
      this.fertForm.patchValue({
        fertFreq: plant.fertFreq,
        fertLast: plant.fertLast,
        fertType: plant.fertType
      })
    }
  }

  submit(): void {
    if (this.id) {
      const plant = this.fertForm.value as Plant;

      plant.id = this.id;
      this.plantService.update(plant).subscribe(() => {
        if (this.bottomSheetRef) this.bottomSheetRef.dismiss();
      });
    }
  }
}
