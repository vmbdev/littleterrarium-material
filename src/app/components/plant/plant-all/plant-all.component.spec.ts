import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantAllComponent } from './plant-all.component';

describe('PlantAllComponent', () => {
  let component: PlantAllComponent;
  let fixture: ComponentFixture<PlantAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
