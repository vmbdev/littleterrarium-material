import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationFormLightComponent } from './location-form-light.component';

describe('LocationFormLightComponent', () => {
  let component: LocationFormLightComponent;
  let fixture: ComponentFixture<LocationFormLightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationFormLightComponent ]
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
