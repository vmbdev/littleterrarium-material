import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangSwitcherButtonComponent } from './lang-switcher-button.component';

describe('LangSwitcherButtonComponent', () => {
  let component: LangSwitcherButtonComponent;
  let fixture: ComponentFixture<LangSwitcherButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangSwitcherButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LangSwitcherButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
