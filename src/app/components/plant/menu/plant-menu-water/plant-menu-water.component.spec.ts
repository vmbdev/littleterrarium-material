import { PlantMenuWaterComponent } from './plant-menu-water.component';
import { MockBuilder } from 'ng-mocks';

describe('PlantMenuWaterComponent', () => {

  beforeEach(() => {
    return MockBuilder(PlantMenuWaterComponent);
  });

  it('should create', () => {
    const component = PlantMenuWaterComponent;
    expect(component).toBeTruthy();
  });
});
