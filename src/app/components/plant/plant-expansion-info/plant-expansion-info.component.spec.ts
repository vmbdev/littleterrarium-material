import { MockBuilder } from 'ng-mocks';
import { PlantExpansionInfoComponent } from './plant-expansion-info.component';

describe('PlantExpansionInfoComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantExpansionInfoComponent);
  });

  it('should create', () => {
    const component = PlantExpansionInfoComponent;
    expect(component).toBeTruthy();
  });
});
