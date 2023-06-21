import { MockBuilder } from 'ng-mocks';

import { PlantComponent } from './plant.component';

describe('PlantComponent', () => {
  beforeEach(async () => {
    return MockBuilder(PlantComponent);
  });

  it('should create', () => {
    const component = PlantComponent;
    expect(component).toBeTruthy();
  });
});
