import { TranslateService } from '@ngx-translate/core';
import { MockBuilder } from 'ng-mocks';

import { PlantButtonWaterComponent } from './plant-button-water.component';

describe('PlantButtonWaterComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantButtonWaterComponent)
      .mock(TranslateService)
  });

  it('should create', () => {
    const component = PlantButtonWaterComponent;
    expect(component).toBeTruthy();
  });
});