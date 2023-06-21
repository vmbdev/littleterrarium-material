import { MockBuilder } from 'ng-mocks';

import { PlantToolbarComponent } from './plant-toolbar.component';

describe('PlantToolbarComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantToolbarComponent);
  });

  it('should create', () => {
    const component = PlantToolbarComponent;
    expect(component).toBeTruthy();
  });
});
