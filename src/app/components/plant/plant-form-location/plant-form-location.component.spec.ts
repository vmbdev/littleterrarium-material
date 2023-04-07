import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantFormLocationComponent } from './plant-form-location.component';

describe('PlantFormLocationComponent', () => {
  let component: PlantFormLocationComponent;
  let fixture: ComponentFixture<PlantFormLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantFormLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantFormLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
