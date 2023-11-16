import { MockBuilder } from 'ng-mocks';
import { CoreModule } from '../core.module';
import { BottomToolbarComponent } from './bottom-toolbar.component';

describe('BottomToolbarComponent', () => {
  beforeEach(() => {
    return MockBuilder(BottomToolbarComponent, CoreModule);
  });

  it('should create', () => {
    const component = BottomToolbarComponent;
    expect(component).toBeTruthy();
  });
});
