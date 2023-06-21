import { MockBuilder } from 'ng-mocks';

import { PlantWaterWidgetComponent } from './plant-water-widget.component';

describe('PlantWaterWidgetComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantWaterWidgetComponent);
  });

  it('should create', () => {
    const component = PlantWaterWidgetComponent;
    expect(component).toBeTruthy();
  });
});
