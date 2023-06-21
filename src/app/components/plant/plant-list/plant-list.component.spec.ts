import { MockBuilder } from 'ng-mocks';

import { PlantListComponent } from './plant-list.component';

describe('PlantListComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantListComponent);
  });

  it('should create', () => {
    const component = PlantListComponent;
    expect(component).toBeTruthy();
  });
});
