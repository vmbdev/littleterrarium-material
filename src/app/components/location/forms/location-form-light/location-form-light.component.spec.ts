import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@ngneat/transloco';
import { LocationService } from '@services/location.service';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';
import { of } from 'rxjs';

import { LocationFormLightComponent } from './location-form-light.component';

describe('LocationFormLightComponent', () => {
  let component: LocationFormLightComponent;
  let fixture: ComponentFixture<LocationFormLightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LocationFormLightComponent,
        // MockPipe(TranslocoService, value => value)
      ],
      providers: [
        ...MockProviders(LocationService,TranslocoService),
      ],
      declarations: [
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationFormLightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
