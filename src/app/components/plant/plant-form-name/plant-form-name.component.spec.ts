import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantFormNameComponent } from './plant-form-name.component';

describe('PlantFormNameComponent', () => {
  let component: PlantFormNameComponent;
  let fixture: ComponentFixture<PlantFormNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantFormNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantFormNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
