import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder } from 'ng-mocks';

import { PlantFormConditionComponent } from './plant-form-condition.component';

describe('PlantFormConditionComponent', () => {
  beforeEach( () => {
    return MockBuilder(PlantFormConditionComponent)
      .mock(TranslateService)
      .keep(FormBuilder)
  });

  it('should create', () => {
    const component = PlantFormConditionComponent;
    expect(component).toBeTruthy();
  });
});
