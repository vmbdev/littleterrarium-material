import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoFormDateComponent } from './photo-form-date.component';

describe('PhotoFormDateComponent', () => {
  let component: PhotoFormDateComponent;
  let fixture: ComponentFixture<PhotoFormDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PhotoFormDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoFormDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
