import { PlantMenuFertComponent } from './plant-menu-fert.component';
import { MockBuilder } from 'ng-mocks';

describe('PlantMenuFertComponent', () => {

  beforeEach(() => {
    return MockBuilder(PlantMenuFertComponent);
  });

  it('should create', () => {
    const component = PlantMenuFertComponent;
    expect(component).toBeTruthy();
  });
});
