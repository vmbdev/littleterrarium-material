import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Plant, potChoices } from '@models/plant.model';
import { PlantService } from '@services/plant.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'plant-edit-soil',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './plant-edit-soil.component.html',
  styleUrls: ['./plant-edit-soil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantEditSoilComponent {
  potForm = this.fb.group({
    potSize: new FormControl<number | null>(null),
    potSizeUnits: new FormControl<'cm' | 'in'>('cm', Validators.required),
    potType: new FormControl<string | null>(null),
    soil: new FormControl<string | null>(null)
  });
  id?: number;
  today = new Date();
  selectedPot: string | null = null;
  pots = this.getPots();

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
      this.selectPot(plant.potType);

      this.potForm.patchValue({
        potSize: plant.potSize,
        potType: plant.potType,
        soil: plant.soil
      });

    }
  }

  selectPot(id: any): void {
    // deselect 
    if (id === this.selectedPot) this.selectedPot = null;
    else this.selectedPot = id;

    this.potForm.patchValue({
      potType: this.selectedPot
    });
  }

  getPots(): any[] {
    return Object.keys(potChoices).map(key => { return { id: key, ...potChoices[key] } });
  }

  submit(): void {
    if (this.id) {
      const plant = this.potForm.value as Plant;

      plant.id = this.id;

      if (plant.potSize) {
        plant.potSize = this.potForm.value.potSizeUnits === 'in' ? plant.potSize * 2.54 : plant.potSize;
      }

      this.plantService.update(plant).subscribe(() => {
        if (this.bottomSheetRef) this.bottomSheetRef.dismiss();
      });
    }
  }
}
