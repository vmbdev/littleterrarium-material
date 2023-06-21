import { MockBuilder } from 'ng-mocks';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  beforeEach(() => {
    return MockBuilder(HomeComponent);
  });

  it('should create', () => {
    const component = HomeComponent;
    expect(component).toBeTruthy();
  });
});
