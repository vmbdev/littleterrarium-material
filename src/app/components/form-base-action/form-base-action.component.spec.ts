import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBaseActionComponent } from './form-base-action.component';

describe('FormBaseActionComponent', () => {
  let component: FormBaseActionComponent;
  let fixture: ComponentFixture<FormBaseActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBaseActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBaseActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
