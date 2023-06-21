import { MockBuilder } from 'ng-mocks';

import { PlantEditWaterComponent } from './plant-edit-water.component';

describe('PlantEditWaterComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantEditWaterComponent);
  });

  it('should create', () => {
    const component = PlantEditWaterComponent;
    expect(component).toBeTruthy();
  });
});
