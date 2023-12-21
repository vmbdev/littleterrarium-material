import { NavigationComponent } from './navigation.component';
import { MockBuilder } from 'ng-mocks';

describe('NavigationComponent', () => {
  beforeEach(() => {
    return MockBuilder(NavigationComponent);
  });

  it('should compile', () => {
    const component = NavigationComponent;
    expect(component).toBeTruthy();
  });
});
