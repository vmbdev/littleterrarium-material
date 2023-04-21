import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormBioComponent } from './user-form-bio.component';

describe('UserFormBioComponent', () => {
  let component: UserFormBioComponent;
  let fixture: ComponentFixture<UserFormBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserFormBioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
