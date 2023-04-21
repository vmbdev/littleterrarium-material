import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormEmailComponent } from './user-form-email.component';

describe('UserFormEmailComponent', () => {
  let component: UserFormEmailComponent;
  let fixture: ComponentFixture<UserFormEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserFormEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
