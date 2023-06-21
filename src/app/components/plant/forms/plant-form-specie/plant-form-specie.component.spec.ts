import { MockBuilder } from 'ng-mocks';

import { PlantFormSpecieComponent } from './plant-form-specie.component';

describe('PlantFormSpecieComponent', () => {

  beforeEach(() => {
    return MockBuilder(PlantFormSpecieComponent);
  });

  it('should create', () => {
    const component = PlantFormSpecieComponent;
    expect(component).toBeTruthy();
  });
});
