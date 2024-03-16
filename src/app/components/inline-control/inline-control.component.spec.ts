import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineControlComponent } from './inline-control.component';

describe('InlineControlComponent', () => {
  let component: InlineControlComponent;
  let fixture: ComponentFixture<InlineControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InlineControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
