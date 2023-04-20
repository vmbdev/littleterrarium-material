import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantWaterWidgetComponent } from './plant-water-widget.component';

describe('PlantWaterWidgetComponent', () => {
  let component: PlantWaterWidgetComponent;
  let fixture: ComponentFixture<PlantWaterWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantWaterWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantWaterWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
