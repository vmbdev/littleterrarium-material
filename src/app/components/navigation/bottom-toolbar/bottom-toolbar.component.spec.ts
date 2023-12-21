import { MockBuilder } from 'ng-mocks';
import { BottomToolbarComponent } from './bottom-toolbar.component';

describe('BottomToolbarComponent', () => {
  beforeEach(() => {
    return MockBuilder(BottomToolbarComponent);
  });

  it('should create', () => {
    const component = BottomToolbarComponent;
    expect(component).toBeTruthy();
  });
});
