import { MockBuilder } from 'ng-mocks';

import { PlantAllComponent } from './plant-all.component';

describe('PlantAllComponent', () => {

  beforeEach(() => {
    return MockBuilder(PlantAllComponent);
  });

  it('should create', () => {
    const component = PlantAllComponent;
    expect(component).toBeTruthy();
  });
});
