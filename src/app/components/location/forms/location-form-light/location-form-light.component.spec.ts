import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { TranslocoModule } from '@ngneat/transloco';
import { LocationFormLightComponent } from './location-form-light.component';
import { getTranslocoModule } from 'src/app/tests/transloco.module';

describe('LocationFormLightComponent', () => {
  let component: LocationFormLightComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder([LocationFormLightComponent, TranslocoModule])
      .provide(getTranslocoModule().providers ?? [])
      .keep(FormBuilder)
      .keep(ReactiveFormsModule)
  );

  beforeEach(() => {
    fixture = MockRender(LocationFormLightComponent, {
      currentLight: 'SHADE',
    });
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a value from input and set it to the form control', () => {
    expect(component.form.get('light')?.value).toBe('SHADE');
  })
});
