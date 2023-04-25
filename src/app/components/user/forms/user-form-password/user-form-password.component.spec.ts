import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormPasswordComponent } from './user-form-password.component';

describe('UserFormPasswordComponent', () => {
  let component: UserFormPasswordComponent;
  let fixture: ComponentFixture<UserFormPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserFormPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
