import { PlantBaseActionComponent } from './plant-base-action.component';
import { MockBuilder } from 'ng-mocks';
import { PlantService } from '@services/plant.service';

describe('PlantBaseActionComponent', () => {
  beforeEach(() => {
    return MockBuilder(PlantBaseActionComponent)
      .mock(PlantService);
  });

  it('should create', () => {
    const component = PlantBaseActionComponent;
    expect(component).toBeTruthy();
  });
});
