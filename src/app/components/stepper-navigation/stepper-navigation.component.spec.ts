import { MockBuilder } from 'ng-mocks';
import { StepperNavigationComponent } from './stepper-navigation.component';

describe('StepperNavigationComponent', () => {
  beforeEach(() => {
    return MockBuilder(StepperNavigationComponent);
  });

  it('should create', () => {
    const component = StepperNavigationComponent;
    expect(component).toBeTruthy();
  });
});
