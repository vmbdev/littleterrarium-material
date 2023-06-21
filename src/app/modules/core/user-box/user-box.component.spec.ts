import { MockBuilder } from 'ng-mocks';
import { CoreModule } from '../core.module';

import { UserBoxComponent } from './user-box.component';

describe('UserBoxComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserBoxComponent, CoreModule);
  });

  it('should create', () => {
    const component = UserBoxComponent;
    expect(component).toBeTruthy();
  });
});
