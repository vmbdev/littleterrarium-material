import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationAddComponent } from './location-add.component';

describe('LocationAddComponent', () => {
  let component: LocationAddComponent;
  let fixture: ComponentFixture<LocationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
