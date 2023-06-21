import { MockBuilder } from 'ng-mocks';

import { PlantSoilWidgetComponent } from './plant-soil-widget.component';

describe('PlantSoilWidgetComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantSoilWidgetComponent);
  });

  it('should create', () => {
    const component = PlantSoilWidgetComponent;
    expect(component).toBeTruthy();
  });
});
