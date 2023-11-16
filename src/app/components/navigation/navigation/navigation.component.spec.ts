import { NavigationComponent } from './navigation.component';
import { MockBuilder } from 'ng-mocks';
import { CoreModule } from '../core.module';

describe('NavigationComponent', () => {
  beforeEach(() => {
    return MockBuilder(NavigationComponent, CoreModule);
  });

  it('should compile', () => {
    const component = NavigationComponent;
    expect(component).toBeTruthy();
  });
});
