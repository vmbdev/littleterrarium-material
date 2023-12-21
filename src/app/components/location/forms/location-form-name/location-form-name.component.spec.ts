import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoModule } from '@ngneat/transloco';

import { LocationFormNameComponent } from './location-form-name.component';

describe('LocationFormNameComponent', () => {
  let component: LocationFormNameComponent;
  let fixture: ComponentFixture<LocationFormNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LocationFormNameComponent,
        TranslocoModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationFormNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
