import { MockBuilder } from 'ng-mocks';

import { PlantEditFertilizerComponent } from './plant-edit-fertilizer.component';

describe('PlantEditFertilizerComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantEditFertilizerComponent);
  });

  it('should create', () => {
    const component = PlantEditFertilizerComponent;
    expect(component).toBeTruthy();
  });
});
