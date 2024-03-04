import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPicComponent } from './current-pic.component';

describe('CurrentPicComponent', () => {
  let component: CurrentPicComponent;
  let fixture: ComponentFixture<CurrentPicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentPicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
