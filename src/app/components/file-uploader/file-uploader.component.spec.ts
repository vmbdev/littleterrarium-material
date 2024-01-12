import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

import { FileUploaderComponent } from './file-uploader.component';

describe('FileUploaderComponent', () => {
  let component: FileUploaderComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder(FileUploaderComponent)
  );

  beforeEach(() => {
    fixture = MockRender(FileUploaderComponent, {
      maxAmount: 5,
      removable: false,
    });
    component = fixture.point.componentInstance;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
