import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantEditWaterComponent } from './plant-edit-water.component';

describe('PlantEditWaterComponent', () => {
  let component: PlantEditWaterComponent;
  let fixture: ComponentFixture<PlantEditWaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantEditWaterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantEditWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
