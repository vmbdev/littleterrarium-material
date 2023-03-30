import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationFormNameComponent } from './location-form-name.component';

describe('LocationFormNameComponent', () => {
  let component: LocationFormNameComponent;
  let fixture: ComponentFixture<LocationFormNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationFormNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationFormNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
