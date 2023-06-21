import { MockBuilder } from 'ng-mocks';

import { PlantFormLocationComponent } from './plant-form-location.component';

describe('PlantFormLocationComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantFormLocationComponent)
  });

  it('should create', () => {
    const component = PlantFormLocationComponent
    expect(component).toBeTruthy();
  });
});
