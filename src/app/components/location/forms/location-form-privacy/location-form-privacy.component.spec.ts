import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationFormPrivacyComponent } from './location-form-privacy.component';

describe('LocationFormPrivacyComponent', () => {
  let component: LocationFormPrivacyComponent;
  let fixture: ComponentFixture<LocationFormPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationFormPrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationFormPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
