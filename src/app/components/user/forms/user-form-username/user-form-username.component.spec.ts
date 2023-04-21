import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormUsernameComponent } from './user-form-username.component';

describe('UserFormUsernameComponent', () => {
  let component: UserFormUsernameComponent;
  let fixture: ComponentFixture<UserFormUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserFormUsernameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
