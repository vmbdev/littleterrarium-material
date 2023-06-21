import { MockBuilder } from 'ng-mocks';

import { ToggleOptionComponent } from './toggle-option.component';

describe('ToggleOptionComponent', () => {
  beforeEach(() => {
    return MockBuilder(ToggleOptionComponent);
  });

  it('should create', () => {
    const component = ToggleOptionComponent;
    expect(component).toBeTruthy();
  });
});
