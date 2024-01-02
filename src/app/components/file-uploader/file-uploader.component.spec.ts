import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

import { FileUploaderComponent } from './file-uploader.component';

describe('FileUploaderComponent', () => {
  const component = FileUploaderComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder(FileUploaderComponent)
  );

  beforeEach(() => {
    fixture = MockRender(FileUploaderComponent, {
      maxAmount: 5,
      removable: false,
    });
  })

  it('should create', () => {
    const component = FileUploaderComponent;
    expect(component).toBeTruthy();
  });
});
