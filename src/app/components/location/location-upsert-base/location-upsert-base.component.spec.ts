import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationUpsertBaseComponent } from './location-upsert-base.component';

describe('LocationUpsertBaseComponent', () => {
  let component: LocationUpsertBaseComponent;
  let fixture: ComponentFixture<LocationUpsertBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationUpsertBaseComponent ]
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
