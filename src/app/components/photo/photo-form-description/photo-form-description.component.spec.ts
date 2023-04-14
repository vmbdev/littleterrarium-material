import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoFormDescriptionComponent } from './photo-form-description.component';

describe('PhotoFormDescriptionComponent', () => {
  let component: PhotoFormDescriptionComponent;
  let fixture: ComponentFixture<PhotoFormDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PhotoFormDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoFormDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
