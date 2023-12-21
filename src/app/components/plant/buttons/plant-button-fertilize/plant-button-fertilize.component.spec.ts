import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder } from 'ng-mocks';

import { PlantButtonFertilizeComponent } from './plant-button-fertilize.component';

describe('PlantButtonFertilizeComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantButtonFertilizeComponent)
      .mock(TranslocoService)
  });

  it('should create', () => {
    const component = PlantButtonFertilizeComponent;
    expect(component).toBeTruthy();
  });
});
