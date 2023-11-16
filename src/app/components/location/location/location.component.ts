import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { catchError, EMPTY } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  PlantListComponent
} from '@components/plant/plant-list/plant-list.component';
import {
  PropertyComponent
} from '@components/info-box/property/property.component';
import {
  InfoBoxComponent
} from "@components/info-box/info-box/info-box.component";
import { FabComponent } from '@components/fab/fab.component';
import {
  LocationEditComponent
} from '@components/location/location-edit/location-edit.component';
import {
  ConfirmDialogComponent
} from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { MainToolbarService } from '@services/main-toolbar.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { Light, Location } from '@models/location.model';

@Component({
  selector: 'ltm-location',
  standalone: true,
  imports: [
    CommonModule,
    MatBottomSheetModule,
    MatDialogModule,
    TranslateModule,
    PlantListComponent,
    PropertyComponent,
    InfoBoxComponent,
    FabComponent
  ],
  templateUrl: './location.component.html'
})
export class LocationComponent {
  private id?: number;
  light = Light;

  constructor(
    public locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private mt: MainToolbarService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    this.locationService.location$
    .pipe(takeUntilDestroyed())
    .subscribe((location: Location | null) => {
      if (location) this.processLocation(location);
    });
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;
    
    if (this.id) {
      this.getLocation();
    }
  }


  getLocation(): void {
    if (!this.id) return;

    this.locationService.get(this.id, { plantCount: true }).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg: string;

        if (err.error?.msg === 'LOCATION_NOT_FOUND') msg = 'location.invalid';
        else msg = 'errors.server';

        this.translate.get(msg).subscribe((res: string) => {
          this.errorHandler.push(res);
        });
        
        this.router.navigateByUrl('/');
        
        return EMPTY;
      })
    ).subscribe((location: Location) => {
      // this.processLocation(location);
    })
  }

  processLocation(location: Location): void {
    this.mt.setName(location.name);
    this.mt.setButtons([]);
    this.mt.setMenu([
      [{
        icon: 'edit',
        tooltip: 'general.edit',
        click: () => { this.openBottomSheet() }
      }],
      [{
        icon: 'delete',
        tooltip: 'general.delete',
        click: () => { this.openRemoveDialog(location.id)}
      }],
    ]);
  }

  openRemoveDialog(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('general.delete'),
        question: [this.translate.instant('location.remove')],
        accept: () => { this.delete(id) }
      },
    });
  }

  delete(id: number) {
    this.locationService.delete(id).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        if (err.msg === 'LOCATION_NOT_VALID') {
          this.translate.get('location.invalid').subscribe((res: string) => {
            this.errorHandler.push(res);
          })
        }
      }
    });
  }

  openBottomSheet(): void {
    if (this.id) {
      this.bottomSheet.open(LocationEditComponent, {
        data: { id: this.id }
      });
    }
  }
}
