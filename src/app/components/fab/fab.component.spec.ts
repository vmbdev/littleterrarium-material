import { fakeAsync } from '@angular/core/testing';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockRender, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';

import { FabComponent } from './fab.component';

describe('FabComponent', () => {
  beforeEach(() => {
    return MockBuilder(FabComponent)
      .keep(RouterModule)
      .keep(RouterTestingModule.withRoutes([]))
      .keep(NG_MOCKS_ROOT_PROVIDERS)
  });

  it('should create', () => {
    const component = FabComponent;
    expect(component).toBeTruthy();
  });

  it('renders /1 with Target1Component', fakeAsync(() => {
    const fixture = MockRender(RouterOutlet, {});
  }));
});
