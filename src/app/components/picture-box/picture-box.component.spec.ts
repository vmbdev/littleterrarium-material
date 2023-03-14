import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureBoxComponent } from './picture-box.component';

describe('PictureBoxComponent', () => {
  let component: PictureBoxComponent;
  let fixture: ComponentFixture<PictureBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PictureBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictureBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
