import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';
import { Location } from '@models/location.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { of } from 'rxjs';

import { LocationComponent } from './location.component';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LocationComponent,
        ...MockComponents(
          PlantListComponent
        )
      ],
      providers: [
        MockProvider(ActivatedRoute, {
          snapshot: {
            paramMap: convertToParamMap({
              locationId: '1'
            })
          }
        }, 'useValue'),
        MockProvider(LocationService, {
          get: () => of({} as Location),
          location$: of({} as Location)
        }),
        ...MockProviders(
          ErrorHandlerService,
          TranslateService,
          MatBottomSheet,
          MatDialog
        )
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
