import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { SettingsCardComponent } from '@components/settings-card/settings-card.component';
import { PlantService } from '@services/plant/plant.service';
import { Plant } from '@models/plant.model';
import { FullWidthDirective } from '@directives/full-width/full-width.directive';

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
    TranslocoModule,
    EditPageComponent,
    SettingsCardComponent,
    FullWidthDirective,
  ],
  templateUrl: './plant-edit-fertilizer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantEditFertilizerComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly plantService = inject(PlantService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef, { optional: true });

  protected readonly fertForm = this.fb.group({
    fertFreq: new FormControl<number | null>(null),
    fertLast: new FormControl<Date | null>(null),
    fertType: new FormControl<string | null>(null),
  });
  private id?: number;
  protected today = new Date();

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
