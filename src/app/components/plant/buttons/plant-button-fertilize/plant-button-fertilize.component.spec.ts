import { TranslateService } from '@ngx-translate/core';
import { MockBuilder } from 'ng-mocks';

import { PlantButtonFertilizeComponent } from './plant-button-fertilize.component';

describe('PlantButtonFertilizeComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantButtonFertilizeComponent)
      .mock(TranslateService)
  });

  it('should create', () => {
    const component = PlantButtonFertilizeComponent;
    expect(component).toBeTruthy();
  });
});
