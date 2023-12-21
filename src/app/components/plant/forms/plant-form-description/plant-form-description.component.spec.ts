import { FormBuilder } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder } from 'ng-mocks';

import { PlantFormDescriptionComponent } from './plant-form-description.component';

describe('PlantFormDescriptionComponent', () => {
  beforeEach( () => {
    return MockBuilder(PlantFormDescriptionComponent)
      .mock(TranslocoService)
      .keep(FormBuilder)
  });

  it('should create', () => {
    const component = PlantFormDescriptionComponent;
    expect(component).toBeTruthy();
  });
});
