import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantToolbarComponent } from './plant-toolbar.component';

describe('PlantToolbarComponent', () => {
  let component: PlantToolbarComponent;
  let fixture: ComponentFixture<PlantToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
