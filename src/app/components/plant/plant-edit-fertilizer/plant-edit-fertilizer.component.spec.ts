import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantEditFertilizerComponent } from './plant-edit-fertilizer.component';

describe('PlantEditFertilizerComponent', () => {
  let component: PlantEditFertilizerComponent;
  let fixture: ComponentFixture<PlantEditFertilizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantEditFertilizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantEditFertilizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
