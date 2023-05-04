import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrariumComponent } from './terrarium.component';

describe('TerrariumComponent', () => {
  let component: TerrariumComponent;
  let fixture: ComponentFixture<TerrariumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TerrariumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerrariumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
