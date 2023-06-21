import { MockBuilder } from 'ng-mocks';
import { PlantFormPrivacyComponent } from './plant-form-privacy.component';

describe('PlantFormPrivacyComponent', () => {
  beforeEach(async () => {
    return MockBuilder(PlantFormPrivacyComponent);
  });

  it('should create', () => {
    const component = PlantFormPrivacyComponent;
    expect(component).toBeTruthy();
  });
});
