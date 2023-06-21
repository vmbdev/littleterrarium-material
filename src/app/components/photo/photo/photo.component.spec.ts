import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder } from 'ng-mocks';

import { PhotoComponent } from './photo.component';

describe('PhotoComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoComponent)
      .keep(RouterTestingModule)
      .mock(TranslateService)
  });

  it('should create', () => {
    const component = PhotoComponent;
    expect(component).toBeTruthy();
  });
});
