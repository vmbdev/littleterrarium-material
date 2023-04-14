import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoFormPrivacyComponent } from './photo-form-privacy.component';

describe('PhotoFormPrivacyComponent', () => {
  let component: PhotoFormPrivacyComponent;
  let fixture: ComponentFixture<PhotoFormPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PhotoFormPrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoFormPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
