import { MockBuilder } from 'ng-mocks';
import { LocationFormLightComponent } from './location-form-light.component';

describe('LocationFormLightComponent', () => {

  beforeEach(async () => {
    return MockBuilder(LocationFormLightComponent)
  });

  it('should create', () => {
    const component = LocationFormLightComponent;
    expect(component).toBeTruthy();
  });
});
