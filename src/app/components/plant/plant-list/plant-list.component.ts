import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
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
import { MatBottomSheet } from '@angular/material/bottom-sheet';

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
    FabComponent
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
    private dialog: MatDialog,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    if (this.list) this.list$.next(this.list);
    else {
      const options = {
        locationId: this.locationId,
        userId: this.userId,
        cover: true
      };

      this.plantService.getMany(options).subscribe((plants: Plant[]) => {
        this.list$.next(plants);
      })
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
        question: this.translate.instant('plant.remove'),
        accept: () => this.delete(id)
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
        const list = this.list$.getValue();
        const index = list.findIndex((plant) => plant.id === updatedPlant.id);
        list[index] = updatedPlant;
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
