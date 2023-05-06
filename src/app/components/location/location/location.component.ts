import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BehaviorSubject, catchError, EMPTY, map } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Light, Location } from '@models/location.model';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { MainToolbarService } from '@services/main-toolbar.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';
import { PropertyComponent } from '@components/info-box/property/property.component';
import { InfoBoxComponent } from "@components/info-box/info-box/info-box.component";
import { FabComponent } from '@components/fab/fab.component';
import { LocationEditComponent } from '@components/location/location-edit/location-edit.component';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';

// TODO: Use LocationService
@Component({
  selector: 'location',
  standalone: true,
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  imports: [
    CommonModule,
    PlantListComponent,
    PropertyComponent,
    InfoBoxComponent,
    FabComponent,
    TranslateModule,
    MatBottomSheetModule,
    MatDialogModule
  ]
})
export class LocationComponent {
  private id?: number;
  location$ = new BehaviorSubject<Location | null>(null);
  owned: boolean = false;

  constructor(
    private api: ApiService,
    private locationService: LocationService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private mt: MainToolbarService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;
    
    if (this.id) this.getLocation();
  }

  getLocation(): void {
    if (!this.id) return;

    const obs = this.api.getLocation(this.id, { plantCount: true }).pipe(
      map((location: Location) => {
        this.processLocation(location);

        return location;
      }),
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
    );

    obs.subscribe((res) => { this.location$.next(res) });
  }

  processLocation(location: Location): void {
    this.owned = (this.auth.user$.getValue()?.id === location.ownerId) ? true : false;
        
    this.mt.setName(location.name);
    this.mt.setButtons([]);
    this.mt.setMenu([
      [{ icon: 'edit', tooltip: 'general.edit', click: () => { this.openBottomSheet() } }],
      [{ icon: 'delete', tooltip: 'general.delete', click: () => { this.openRemoveDialog(location.id)} }],
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
      const bsRef = this.bottomSheet.open(LocationEditComponent, {
        data: { id: this.id }
      });

      bsRef.afterDismissed().subscribe((updatedLocation: Location) => {
        if (updatedLocation) {
          const currentLocation = this.location$.getValue();

          if (currentLocation) {
            updatedLocation.plants = currentLocation.plants;
            this.location$.next(updatedLocation);
            this.processLocation(updatedLocation);
          }
        }
      });
    }
  }

  getLightName(light: string): string {
    return Light[light].desc;
  }

  getLightAsset(light: string): string {
    let icon: string;

    if (light === 'FULLSUN') icon = 'brightness_7';
    else if (light === 'PARTIALSUN') icon = 'brightness_6';
    else icon = 'brightness_5';

    return icon;
  }
}
