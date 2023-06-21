import { MockBuilder } from 'ng-mocks';
import { BACKEND_URL } from 'src/tokens';

import { PhotoListComponent } from './photo-list.component';

describe('PhotoListComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoListComponent)
      .mock(BACKEND_URL)
  });

  it('should create', () => {
    const component = PhotoListComponent;
    expect(component).toBeTruthy();
  });
});
