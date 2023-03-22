import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Light, Location } from '@models/location.model';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { MainToolbarService } from '@services/main-toolbar.service';
import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PropertyComponent } from '@components/property/property.component';
import { InfoBoxComponent } from "@components/info-box/info-box.component";

@Component({
    selector: 'location',
    standalone: true,
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss'],
    imports: [
      CommonModule,
      PlantListComponent,
      PropertyComponent,
      InfoBoxComponent
    ]
})
export class LocationComponent {
  private id?: number;
  location$?: Observable<Location>;
  owned: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private mt: MainToolbarService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;
    
    if (this.id) {
      this.location$ = this.api.getLocation(this.id, true).pipe(
        map((location: Location) => {
          
          this.owned = (this.auth.user$.getValue()?.id === location.ownerId) ? true : false;
          
          this.mt.setName(location.name);
          this.mt.setButtons([
            { icon: 'search' },
            { icon: 'sort' },
            { icon: 'view_list' },
          ]);

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
