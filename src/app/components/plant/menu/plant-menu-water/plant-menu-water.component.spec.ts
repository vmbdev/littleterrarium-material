import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMenuWaterComponent } from './plant-menu-water.component';

describe('PlantMenuWaterComponent', () => {
  let component: PlantMenuWaterComponent;
  let fixture: ComponentFixture<PlantMenuWaterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlantMenuWaterComponent]
    });
    fixture = TestBed.createComponent(PlantMenuWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
