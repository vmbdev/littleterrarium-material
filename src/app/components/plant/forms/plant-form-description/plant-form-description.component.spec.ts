import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantFormDescriptionComponent } from './plant-form-description.component';

describe('PlantFormDescriptionComponent', () => {
  let component: PlantFormDescriptionComponent;
  let fixture: ComponentFixture<PlantFormDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantFormDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantFormDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
