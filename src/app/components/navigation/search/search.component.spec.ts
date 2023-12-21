import { MockBuilder } from 'ng-mocks';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  beforeEach(() => {
    return MockBuilder(SearchComponent);
  });

  it('should create', () => {
    const component = SearchComponent;
    expect(component).toBeTruthy();
  });
});
