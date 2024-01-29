import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheetModule,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { PlantEditSoilComponent } from '@components/plant/plant-edit-soil/plant-edit-soil.component';
import { PlantService } from '@services/plant.service';
import { Plant, Pot } from '@models/plant.model';
import { UnitPipe } from '@pipes/unit/unit.pipe';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'ltm-plant-soil-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
    TranslocoModule,
    UnitPipe,
  ],
  templateUrl: './plant-soil-widget.component.html',
})
export class PlantSoilWidgetComponent {
  protected potName?: string;
  protected plant$?: Observable<Plant | null>;

  constructor(
    public readonly plantService: PlantService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly translate: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.plant$ = this.plantService.plant$.pipe(
      map((plant: Plant | null) => {
        if (plant) {
          this.potName = this.getPotName();

          return plant;
        }

        return null;
      }),
    );
  }

  getPotName(): string {
    let potName;
    const potType = this.plantService.current()?.potType;

    if (potType) potName = this.plantService.getPotInfo(potType).name;
    else potName = 'general.unknown';

    return potName;
  }

  openEdit(): void {
    this.bottomSheet.open(PlantEditSoilComponent);
  }
}
