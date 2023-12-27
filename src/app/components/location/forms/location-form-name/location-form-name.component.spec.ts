import { MockBuilder } from 'ng-mocks';
import { LocationFormNameComponent } from './location-form-name.component';

describe('LocationFormNameComponent', () => {
  beforeEach(async () => {
    return MockBuilder(LocationFormNameComponent);
  });

  it('should create', () => {
    const component = LocationFormNameComponent;
    expect(component).toBeTruthy();
  });
});
