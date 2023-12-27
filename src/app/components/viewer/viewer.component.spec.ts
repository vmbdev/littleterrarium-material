import { ViewerComponent } from './viewer.component';
import { MockBuilder } from 'ng-mocks';
import { VIEWER_DATA } from 'src/tokens';

describe('ViewerComponent', () => {

  beforeEach(() => {
    return MockBuilder(ViewerComponent)
      .provide({
        provide: VIEWER_DATA,
        useValue: {
          src: 'test',
          close: () => {},
        }
      })
  });

  it('should create', () => {
    const component = ViewerComponent;
    expect(component).toBeTruthy();
  });
});
