import { MockBuilder } from 'ng-mocks';

import { PlantFertiliseWidgetComponent } from './plant-fertilise-widget.component';

describe('PlantFertiliseWidgetComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantFertiliseWidgetComponent);
  });

  it('should create', () => {
    const component = PlantFertiliseWidgetComponent;
    expect(component).toBeTruthy();
  });
});
