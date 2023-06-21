import { MockBuilder } from 'ng-mocks';

import { PlantEditSoilComponent } from './plant-edit-soil.component';

describe('PlantEditSoilComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantEditSoilComponent);
  });

  it('should create', () => {
    const component = PlantEditSoilComponent;
    expect(component).toBeTruthy();
  });
});
