import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder, MockInstance, MockRender } from 'ng-mocks';

import { PhotoAddComponent } from './photo-add.component';

describe('PhotoAddComponent', () => {
  MockInstance.scope()

  beforeEach(() => {
    return MockBuilder(PhotoAddComponent)
      .keep(FormBuilder)
      .keep(RouterTestingModule)
      .mock(TranslocoService)
  });

  it('should create', () => {
    MockInstance(
      ActivatedRoute,
      'snapshot',
      jasmine.createSpy(),
      'get',
    ).and.returnValue({
      paramMap: new Map([['plantId', '100']]),
    });

    const component = PhotoAddComponent;
    expect(component).toBeTruthy();
  });
});
