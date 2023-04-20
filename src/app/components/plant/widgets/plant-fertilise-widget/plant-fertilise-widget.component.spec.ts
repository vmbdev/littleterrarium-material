import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantFertiliseWidgetComponent } from './plant-fertilise-widget.component';

describe('PlantFertiliseWidgetComponent', () => {
  let component: PlantFertiliseWidgetComponent;
  let fixture: ComponentFixture<PlantFertiliseWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantFertiliseWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantFertiliseWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
