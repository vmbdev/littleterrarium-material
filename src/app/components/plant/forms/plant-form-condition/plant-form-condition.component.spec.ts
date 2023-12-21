import { FormBuilder } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder } from 'ng-mocks';

import { PlantFormConditionComponent } from './plant-form-condition.component';

describe('PlantFormConditionComponent', () => {
  beforeEach( () => {
    return MockBuilder(PlantFormConditionComponent)
      .mock(TranslocoService)
      .keep(FormBuilder)
  });

  it('should create', () => {
    const component = PlantFormConditionComponent;
    expect(component).toBeTruthy();
  });
});
