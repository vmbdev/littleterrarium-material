import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormNameComponent } from './user-form-name.component';

describe('UserFormNameComponent', () => {
  let component: UserFormNameComponent;
  let fixture: ComponentFixture<UserFormNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserFormNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
