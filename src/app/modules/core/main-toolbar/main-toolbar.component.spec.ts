import { MockBuilder } from 'ng-mocks';
import { CoreModule } from '../core.module';

import { MainToolbarComponent } from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  beforeEach(() => {
    return MockBuilder(MainToolbarComponent, CoreModule);
  });

  it('should create', () => {
    const component = MainToolbarComponent;
    expect(component).toBeTruthy();
  });
});
