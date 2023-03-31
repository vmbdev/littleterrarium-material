import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Condition, Plant } from '@models/plant.model';
import { MainToolbarService } from '@services/main-toolbar.service';
import { PlantService } from '@services/plant.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { InfoBoxComponent } from "@components/info-box/info-box.component";
import { PropertyComponent } from "@components/property/property.component";
import { PhotoListComponent } from '@components/photo/photo-list/photo-list.component';
import { FabComponent } from '@components/fab/fab.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'plant',
    standalone: true,
    templateUrl: './plant.component.html',
    styleUrls: ['./plant.component.scss'],
    imports: [
      CommonModule,
      TranslateModule,
      WaitDialogComponent,
      InfoBoxComponent,
      PropertyComponent,
      PhotoListComponent,
      FabComponent,
      MatDialogModule
    ]
})
export class PlantComponent {
  id?: number;
  plantVisibility?: boolean;
  plantCondition = Condition;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private mt: MainToolbarService,
    public plantService: PlantService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('plantId');
    this.id = paramId ? +paramId : NaN;

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
      this.plantVisibility = plant.public;

      this.mt.setName(plant.visibleName ? plant.visibleName : '');
      this.mt.setMenu([
        { icon: 'search', tooltip: 'general.search' },
        { icon: 'sort', tooltip: 'general.sort' },
        { icon: 'view_list', tooltip: 'general.viewList' },
      ]);
    });

  }

  getConditionColor(condition: Condition): string {
    let color: string;

    switch(condition) {
      case 'bad': {
        color = 'red';
        break;
      }
      case 'poor': {
        color = 'yellow';
        break;
      }
      case 'good': {
        color = 'grey';
        break;
      }
      case 'great': {
        color = 'greenyellow';
        break;
      }
      case 'excellent':
      default: {
        color = 'green';
        break;
      }
    }

    return color;
  }
}
