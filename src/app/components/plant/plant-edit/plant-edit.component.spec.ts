import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantEditComponent } from './plant-edit.component';

describe('PlantEditComponent', () => {
  let component: PlantEditComponent;
  let fixture: ComponentFixture<PlantEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
