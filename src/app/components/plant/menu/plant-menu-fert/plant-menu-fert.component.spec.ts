import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMenuFertComponent } from './plant-menu-fert.component';

describe('PlantMenuFertComponent', () => {
  let component: PlantMenuFertComponent;
  let fixture: ComponentFixture<PlantMenuFertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlantMenuFertComponent]
    });
    fixture = TestBed.createComponent(PlantMenuFertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
