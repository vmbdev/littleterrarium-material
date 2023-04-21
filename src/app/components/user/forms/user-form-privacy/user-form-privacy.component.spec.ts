import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormPrivacyComponent } from './user-form-privacy.component';

describe('UserFormPrivacyComponent', () => {
  let component: UserFormPrivacyComponent;
  let fixture: ComponentFixture<UserFormPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserFormPrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
