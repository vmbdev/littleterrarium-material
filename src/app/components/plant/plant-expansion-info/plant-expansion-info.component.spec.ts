import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantExpansionInfoComponent } from './plant-expansion-info.component';

describe('PlantExpansionInfoComponent', () => {
  let component: PlantExpansionInfoComponent;
  let fixture: ComponentFixture<PlantExpansionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantExpansionInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantExpansionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
