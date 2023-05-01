import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantButtonWaterComponent } from './plant-button-water.component';

describe('PlantButtonWaterComponent', () => {
  let component: PlantButtonWaterComponent;
  let fixture: ComponentFixture<PlantButtonWaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantButtonWaterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantButtonWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
