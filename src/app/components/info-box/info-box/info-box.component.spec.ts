import { MockBuilder } from 'ng-mocks';

import { InfoBoxComponent } from './info-box.component';

describe('InfoBoxComponent', () => {
  beforeEach(() => {
    return MockBuilder(InfoBoxComponent);
  });

  it('should create', () => {
    const component = InfoBoxComponent;
    expect(component).toBeTruthy();
  });
});
