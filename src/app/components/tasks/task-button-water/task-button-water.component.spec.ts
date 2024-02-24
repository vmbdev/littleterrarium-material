import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder } from 'ng-mocks';

import { PlantButtonWaterComponent } from './plant-button-water.component';

describe('PlantButtonWaterComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantButtonWaterComponent)
      .mock(TranslocoService)
  });

  it('should create', () => {
    const component = PlantButtonWaterComponent;
    expect(component).toBeTruthy();
  });
});