import { MockBuilder } from 'ng-mocks';

import { FileUploaderComponent } from './file-uploader.component';

describe('FileUploaderComponent', () => {
  beforeEach(() => {
    return MockBuilder(FileUploaderComponent);
  });

  it('should create', () => {
    const component = FileUploaderComponent;
    expect(component).toBeTruthy();
  });
});
