import { MockBuilder } from 'ng-mocks';

import { PropertyComponent } from './property.component';

describe('PropertyComponent', () => {
  beforeEach(() => {
    return MockBuilder(PropertyComponent);
  });

  it('should create', () => {
    const component = PropertyComponent;
    expect(component).toBeTruthy();
  });
});
