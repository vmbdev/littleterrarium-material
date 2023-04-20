import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantSoilWidgetComponent } from './plant-soil-widget.component';

describe('PlantSoilWidgetComponent', () => {
  let component: PlantSoilWidgetComponent;
  let fixture: ComponentFixture<PlantSoilWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantSoilWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantSoilWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
