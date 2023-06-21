import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
        // MockPipe(TranslatePipe, value => value)
      ],
      providers: [
        ...MockProviders(LocationService,TranslateService),
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
