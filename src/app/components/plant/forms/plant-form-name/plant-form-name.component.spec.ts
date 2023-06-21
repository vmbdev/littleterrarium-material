import { MockBuilder } from 'ng-mocks';

import { PlantFormNameComponent } from './plant-form-name.component';

describe('PlantFormNameComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantFormNameComponent)
  });

  it('should create', () => {
    const component = PlantFormNameComponent;
    expect(component).toBeTruthy();
  });
});
