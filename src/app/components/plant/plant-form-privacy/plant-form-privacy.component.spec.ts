import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantFormPrivacyComponent } from './plant-form-privacy.component';

describe('PlantFormPrivacyComponent', () => {
  let component: PlantFormPrivacyComponent;
  let fixture: ComponentFixture<PlantFormPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PlantFormPrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantFormPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
