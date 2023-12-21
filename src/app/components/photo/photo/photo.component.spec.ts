import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder } from 'ng-mocks';

import { PhotoComponent } from './photo.component';

describe('PhotoComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoComponent)
      .keep(RouterTestingModule)
      .mock(TranslocoService)
  });

  it('should create', () => {
    const component = PhotoComponent;
    expect(component).toBeTruthy();
  });
});
