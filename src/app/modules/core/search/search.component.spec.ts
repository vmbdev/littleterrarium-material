import { MockBuilder } from 'ng-mocks';
import { CoreModule } from '../core.module';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  beforeEach(() => {
    return MockBuilder(SearchComponent, CoreModule);
  });

  it('should create', () => {
    const component = SearchComponent;
    expect(component).toBeTruthy();
  });
});
