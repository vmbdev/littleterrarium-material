import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { TranslocoModule } from '@ngneat/transloco';
import { LocationFormNameComponent } from './location-form-name.component';
import { getTranslocoModule } from 'src/app/tests/transloco.module';

describe('LocationFormNameComponent', () => {
  let component: LocationFormNameComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder([LocationFormNameComponent, TranslocoModule])
      .provide(getTranslocoModule().providers ?? [])
      .keep(FormBuilder)
      .keep(ReactiveFormsModule)
  );

  beforeEach(() => {
    fixture = MockRender(LocationFormNameComponent, {
      currentName: 'Test Name',
    });
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a value from input and set it to the form control', () => {
    expect(component.form.get('name')?.value).toBe('Test Name');
  })
});
