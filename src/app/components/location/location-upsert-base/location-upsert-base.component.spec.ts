import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { ApiService } from '@services/api.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { MockProviders } from 'ng-mocks';

import { LocationUpsertBaseComponent } from './location-upsert-base.component';

describe('LocationUpsertBaseComponent', () => {
  let component: LocationUpsertBaseComponent;
  let fixture: ComponentFixture<LocationUpsertBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationUpsertBaseComponent ],
      providers: [
        ...MockProviders(
          TranslocoService,
          MatDialog,
          ApiService,
          LocationService,
          ErrorHandlerService
        )
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationUpsertBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
