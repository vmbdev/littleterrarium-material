import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Plant } from '@models/plant.model';
import { PlantService } from '@services/plant.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FabComponent } from '@components/fab/fab.component';
import { PlantEditComponent } from '../plant-edit/plant-edit.component';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { PlantToolbarComponent } from '../plant-toolbar/plant-toolbar.component';
import { MatRippleModule } from '@angular/material/core';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'plant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatRippleModule,
    MatBottomSheetModule,
    FabComponent,
    PlantToolbarComponent
  ],
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent {
  @Input() list?: Plant[];
  @Input() locationId?: number;
  @Input() userId?: number;
  @Input() owned: boolean = true;
  @Input() small: boolean = false;
  list$ = new BehaviorSubject<Plant[]>([]);

  constructor(
    private plantService: PlantService,
    private locationService: LocationService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    if (this.list) this.list$.next(this.list);

    else {
      let obs: Observable<Plant[]>;

      if (this.locationId) {
        obs = this.locationService.getPlants(this.locationId);
      }
      else {
        const options = {
          userId: this.userId,
          cover: true
        };

        obs = this.plantService.getMany(options);
      }

      obs.subscribe((plants: Plant[]) => {
        this.list$.next(plants);
      });
    }
  }

  getName(plant: Plant): string {
    return this.plantService.getVisibleName(plant);
  }

  getImgUrl(plant: Plant): string {
    return this.plantService.coverPhoto(plant);
  }

  openRemoveDialog(name: string, id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: name,
        question: [this.translate.instant('plant.remove')],
        accept: () => { this.delete(id) }
      },
    });
  }

  openEdit(id: number): void {
    const bsRef = this.bottomSheet.open(PlantEditComponent, {
      data: {
        id,
        config: { cover: true }
      }
    });

    bsRef.afterDismissed().subscribe((updatedPlant: Plant) => {
      if (updatedPlant) {
        let list = this.list$.getValue();
        const index = list.findIndex((plant) => plant.id === updatedPlant.id);

        // we moved the plant, hence we remove it from the list
        if (updatedPlant.locationId !== this.locationId) {
          list.splice(index, 1);
        }
        else list[index] = updatedPlant;

        this.list$.next(list);
      }

    });
  }

  delete(id: number): void {
    this.plantService.delete(id).subscribe(() => {
      const newList = this.list$.getValue().filter((plant: Plant) => plant.id !== id);

      this.list$.next(newList);
    })
  }
}
