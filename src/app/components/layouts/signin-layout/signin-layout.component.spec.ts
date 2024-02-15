import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninLayoutComponent } from './signin-layout.component';

describe('SigninLayoutComponent', () => {
  let component: SigninLayoutComponent;
  let fixture: ComponentFixture<SigninLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SigninLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
