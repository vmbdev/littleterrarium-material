import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBoxComponent } from './user-box.component';

describe('UserBoxComponent', () => {
  let component: UserBoxComponent;
  let fixture: ComponentFixture<UserBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserBoxComponent]
    });
    fixture = TestBed.createComponent(UserBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
