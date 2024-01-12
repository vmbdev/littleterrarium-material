import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';

import { InfoBoxComponent } from './info-box.component';

describe('InfoBoxComponent', () => {
  let component: InfoBoxComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() => MockBuilder(InfoBoxComponent));

  beforeEach(() => {
    fixture = MockRender(InfoBoxComponent, {
      description: 'Test description',
    });
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
