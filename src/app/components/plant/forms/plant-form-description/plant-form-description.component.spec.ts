import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder } from 'ng-mocks';

import { PlantFormDescriptionComponent } from './plant-form-description.component';

describe('PlantFormDescriptionComponent', () => {
  beforeEach( () => {
    return MockBuilder(PlantFormDescriptionComponent)
      .mock(TranslateService)
      .keep(FormBuilder)
  });

  it('should create', () => {
    const component = PlantFormDescriptionComponent;
    expect(component).toBeTruthy();
  });
});
