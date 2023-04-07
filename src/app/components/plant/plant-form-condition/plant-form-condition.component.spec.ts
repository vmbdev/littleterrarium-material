import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantFormConditionComponent } from './plant-form-condition.component';

describe('PlantFormConditionComponent', () => {
  let component: PlantFormConditionComponent;
  let fixture: ComponentFixture<PlantFormConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantFormConditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantFormConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
