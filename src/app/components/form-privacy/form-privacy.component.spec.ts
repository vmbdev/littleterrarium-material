import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { TranslocoModule } from '@ngneat/transloco';
import { FormPrivacyComponent } from './form-privacy.component';
import { getTranslocoModule } from 'src/app/tests/transloco.module';

describe('FormPrivacyComponent', () => {
  let component: FormPrivacyComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder([FormPrivacyComponent, TranslocoModule])
      .provide(getTranslocoModule().providers ?? [])
      .keep(FormBuilder)
      .keep(ReactiveFormsModule)
  );

  beforeEach(() => {
    fixture = MockRender(FormPrivacyComponent, {
      currentPrivacy: false,
    });
    component = fixture.point.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a value from input and set it to the form control', () => {
    expect(component.form.get('public')?.value).toBeFalse();
  })
});
