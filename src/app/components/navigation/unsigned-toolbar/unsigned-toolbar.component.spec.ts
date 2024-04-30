import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsignedToolbarComponent } from './unsigned-toolbar.component';

describe('UnsignedToolbarComponent', () => {
  let component: UnsignedToolbarComponent;
  let fixture: ComponentFixture<UnsignedToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsignedToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnsignedToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
