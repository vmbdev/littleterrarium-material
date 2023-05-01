import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantButtonFertilizeComponent } from './plant-button-fertilize.component';

describe('PlantButtonFertilizeComponent', () => {
  let component: PlantButtonFertilizeComponent;
  let fixture: ComponentFixture<PlantButtonFertilizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantButtonFertilizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantButtonFertilizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
