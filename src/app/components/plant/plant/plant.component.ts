import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { catchError, EMPTY, finalize, forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import {
  InfoBoxComponent
} from '@components/info-box/info-box/info-box.component';
import {
  PropertyComponent
} from '@components/info-box/property/property.component';
import {
  PhotoListComponent
} from '@components/photo/photo-list/photo-list.component';
import { FabComponent } from '@components/fab/fab.component';
import {
  PlantEditComponent
} from '@components/plant/plant-edit/plant-edit.component';
import {
  PlantExpansionInfoComponent
} from '@components/plant/plant-expansion-info/plant-expansion-info.component';
import {
  ConfirmDialogComponent
} from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { MainToolbarService } from '@services/main-toolbar.service';
import { PlantService } from '@services/plant.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Condition, Plant } from '@models/plant.model';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';

@Component({
    selector: 'ltm-plant',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MatDialogModule,
        MatBottomSheetModule,
        MatCardModule,
        MatIconModule,
        PhotoListComponent,
        WaitDialogComponent,
        InfoBoxComponent,
        PropertyComponent,
        FabComponent,
        CapitalizePipe,
        PlantExpansionInfoComponent
    ],
    templateUrl: './plant.component.html'
})
export class PlantComponent {
  id?: number;
  plantCondition = Condition;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private mt: MainToolbarService,
    public plantService: PlantService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('plantId');
    this.id = paramId ? +paramId : NaN;
    this.mt.setButtons([]);

    if (this.id) this.fetchPlantData();
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.instant('general.loading'),
        progressBar: false,
      },
    });
  }

  fetchPlantData(): void {
    if (!this.id) return;

    const wd = this.openWaitDialog();

    this.plantService.get(this.id, { photos: true }).pipe(
      finalize(() => { wd.close() }),
      catchError((err: HttpErrorResponse) => {
        let msg;

        if (err.error?.msg === 'PLANT_NOT_FOUND') msg = 'plant.invalid';
        else msg = 'errors.server';

        this.translate.get(msg).subscribe((res: string) => {
          this.errorHandler.push(res);
        });

        this.router.navigateByUrl('/');

        return EMPTY;
      })
    ).subscribe((plant: Plant) => {
      this.processPlant(plant);
    });

  }

  processPlant(plant: Plant) {
    this.mt.setName(
      plant.visibleName ?
      plant.visibleName :
      this.plantService.getVisibleName(plant)
    );
    this.mt.setMenu([
      [{
        icon: 'edit',
        tooltip: 'general.edit',
        click: () => { this.openEdit() }
      }],
      [{
        icon: 'delete',
        tooltip: 'general.delete',
        click: () => { this.openRemoveDialog() }
      }]
    ]);
  }

  openRemoveDialog() {
    forkJoin({
      title: this.translate.get('general.delete'),
      question: this.translate.get('plant.remove')
    }).subscribe(({ title, question }) => {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title,
          question: [question],
          accept: () => { this.delete() }
        },
      });
    })
  }

  delete(): void {
    const plant = this.plantService.current();

    if (plant) {
      this.plantService.delete(plant.id).subscribe(() => {
        this.router.navigate(['/location', plant.locationId]);
      })
    }
  }

  openEdit(): void {
    if (this.id) {
      const ref = this.bottomSheet.open(PlantEditComponent, {
        data: {
          id: this.id,
          config: { photos: true }
        }
      });

      ref.afterDismissed().subscribe((plant: Plant) => {
        if (plant) {
          const newName =
            plant.visibleName
            ? plant.visibleName
            : this.plantService.getVisibleName(plant);

          this.mt.setName(newName);
        }
      })
    }
  }
}
