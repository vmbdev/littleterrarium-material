import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, shareReplay, Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';

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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { SearchService } from '@services/search.service';

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
  smallView: boolean;

  search$?: Subscription;

  constructor(
    private api: ApiService,
    private locationService: LocationService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private mt: MainToolbarService,
    private search: SearchService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    this.smallView = (localStorage.getItem('LT_plantListView') === 'true');
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;
    
    if (this.id) this.getLocation();

    this.search$ = this.search.text$.subscribe((val: string) => {
      // console.log(val);
    });
  }

  ngOnDestroy(): void {
    if (this.search$) this.search$.unsubscribe();
  }

  setSmallView(val: boolean) {
    this.smallView = val;
    localStorage.setItem('LT_plantListView', val.toString());
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
    this.mt.setButtons([
      { icon: 'search', tooltip: 'general.search', click: () => { this.search.toggle() } },
    ]);
    this.mt.setMenu([
      { icon: 'edit', tooltip: 'general.edit', click: () => { this.openBottomSheet() } },
      { icon: 'sort', tooltip: 'general.sort' },
      { icon: 'view_list', tooltip: 'general.viewList', click: () => { this.setSmallView(true) } },
      { icon: 'preview', tooltip: 'general.viewCards', click: () => { this.setSmallView(false) } },
      { icon: 'delete', tooltip: 'general.delete', click: () => { this.openRemoveDialog(location.id)} }
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
