import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantBaseActionComponent } from './plant-base-action.component';

describe('PlantBaseActionComponent', () => {
  let component: PlantBaseActionComponent;
  let fixture: ComponentFixture<PlantBaseActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlantBaseActionComponent]
    });
    fixture = TestBed.createComponent(PlantBaseActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
