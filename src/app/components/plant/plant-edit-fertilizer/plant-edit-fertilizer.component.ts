import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';

import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';

@Component({
  selector: 'ltm-plant-edit-fertilizer',
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
  ],
  templateUrl: './plant-edit-fertilizer.component.html',
})
export class PlantEditFertilizerComponent {
  protected readonly fertForm = this.fb.group({
    fertFreq: new FormControl<number | null>(null),
    fertLast: new FormControl<Date | null>(null),
    fertType: new FormControl<string | null>(null),
  });
  private id?: number;
  protected today = new Date();

  constructor(
    public readonly plantService: PlantService,
    private readonly fb: FormBuilder,
    @Optional() private readonly bottomSheetRef: MatBottomSheetRef,
  ) {}

  ngOnInit(): void {
    const plant = this.plantService.current();

    if (plant) {
      this.id = plant.id;
      this.fertForm.patchValue({
        fertFreq: plant.fertFreq,
        fertLast: plant.fertLast,
        fertType: plant.fertType,
      });
    }
  }

  submit(): void {
    if (!this.id) return;
    const plant = this.fertForm.value as Plant;

    plant.id = this.id;
    this.plantService.update(plant).subscribe(() => {
      if (this.bottomSheetRef) this.bottomSheetRef.dismiss();
    });
  }
}
