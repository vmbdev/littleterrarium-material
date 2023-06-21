import { MockBuilder } from 'ng-mocks';

import { PlantEditComponent } from './plant-edit.component';

describe('PlantEditComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantEditComponent);
  });

  it('should create', () => {
    const component = PlantEditComponent;
    expect(component).toBeTruthy();
  });
});
