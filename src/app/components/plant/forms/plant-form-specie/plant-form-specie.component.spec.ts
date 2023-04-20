import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantFormSpecieComponent } from './plant-form-specie.component';

describe('PlantFormSpecieComponent', () => {
  let component: PlantFormSpecieComponent;
  let fixture: ComponentFixture<PlantFormSpecieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantFormSpecieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantFormSpecieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
