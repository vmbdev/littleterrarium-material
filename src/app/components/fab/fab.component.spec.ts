import { fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  NG_MOCKS_ROOT_PROVIDERS,
  ngMocks,
} from 'ng-mocks';

import { FabComponent } from './fab.component';

class MockedComponent {}

describe('FabComponent', () => {
  let component: FabComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder([
      FabComponent,
      RouterModule,
      RouterTestingModule.withRoutes([
        {
          path: 'test',
          component: MockedComponent,
        },
      ]),
      NG_MOCKS_ROOT_PROVIDERS,
    ])
  );

  beforeEach(() => {
    fixture = MockRender(FabComponent, {
      link: '/test',
      text: '*',
    });
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate on click', fakeAsync(() => {
    const location: Location = fixture.point.injector.get(Location);
    const el = ngMocks.find(['data-testid', 'fab']);
    ngMocks.click(el);
    tick();

    expect(location.path()).toBe('/test');
  }));
});
