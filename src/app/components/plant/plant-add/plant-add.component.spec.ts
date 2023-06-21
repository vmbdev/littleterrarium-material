import { MockBuilder } from 'ng-mocks';

import { PlantAddComponent } from './plant-add.component';

describe('PlantAddComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantAddComponent);
  });

  it('should create', () => {
    const component = PlantAddComponent;
    expect(component).toBeTruthy();
  });
});
