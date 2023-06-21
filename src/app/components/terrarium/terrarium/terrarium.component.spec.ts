import { MockBuilder } from 'ng-mocks';

import { TerrariumComponent } from './terrarium.component';

describe('TerrariumComponent', () => {
  beforeEach(() => {
    return MockBuilder(TerrariumComponent);
  });

  it('should create', () => {
    const component = TerrariumComponent;
    expect(component).toBeTruthy();
  });
});
