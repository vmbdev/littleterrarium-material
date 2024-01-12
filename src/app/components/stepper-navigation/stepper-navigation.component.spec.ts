import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';
import { TranslocoModule } from '@ngneat/transloco';

import { StepperNavigationComponent } from './stepper-navigation.component';
import { getTranslocoModule } from 'src/app/tests/transloco.module';

describe('StepperNavigationComponent', () => {
  let component: StepperNavigationComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder([StepperNavigationComponent, TranslocoModule])
      .provide(getTranslocoModule().providers ?? [])
  );

  beforeEach(() => {
    fixture = MockRender(StepperNavigationComponent, {
      backButton: true,
      finishButton: false,
    });
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a back button when backButton is true', () => {
    component.backButton = true;
    fixture.detectChanges();

    const el = ngMocks.find(['data-testid', 'prevbutton']);

    expect(el).toBeDefined();
  });

  it('should render a finish button when finishButton is true', () => {
    component.backButton = false;
    component.finishButton = true;
    fixture.detectChanges();

    const el = ngMocks.find(['data-testid', 'finishbutton']);

    expect(el).toBeDefined();
  });

  it('should render a next button when finishButton is false', () => {
    component.backButton = false;
    component.finishButton = false;
    fixture.detectChanges();

    const el = ngMocks.find(['data-testid', 'nextbutton']);

    expect(el).toBeDefined();
  });

  it('should emit the finish event when clicked', () => {
    component.backButton = false;
    component.finishButton = true;
    fixture.detectChanges();

    const spy = spyOn(component.finish, 'emit');
    const el = ngMocks.find(['data-testid', 'finishbutton']);
    ngMocks.click(el);

    expect(spy).toHaveBeenCalled();
  })
});
