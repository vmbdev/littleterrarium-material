import { MockBuilder } from 'ng-mocks';

import { MainToolbarComponent } from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  beforeEach(() => {
    return MockBuilder(MainToolbarComponent);
  });

  it('should create', () => {
    const component = MainToolbarComponent;
    expect(component).toBeTruthy();
  });
});
