import {
  MockBuilder,
  MockInstance,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';

import { TerrariumComponent } from './terrarium.component';
import { ApiService } from '@services/api.service';
import { User } from '@models/user.model';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TerrariumComponent', () => {
  let component: TerrariumComponent;
  let fixture: MockedComponentFixture;

  MockInstance.scope();

  beforeEach(() =>
    MockBuilder(TerrariumComponent)
      .mock(ActivatedRoute)
      .mock(ApiService, {
        getUserByName: () =>
          of({ id: 0, username: 'testuser' } as User),
      })
  );

  beforeEach(() => {
    MockInstance(
      ActivatedRoute,
      'snapshot',
      jasmine.createSpy(),
      'get',
    ).and.returnValue({
      paramMap: new Map([['username', 'testuser']]),
    });

    fixture = MockRender(TerrariumComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the username from route', () => {
    const route = ngMocks.get(ActivatedRoute);
    const username = route.snapshot.paramMap.get('username');

    expect(username).toBe('testuser');
  });

  it('should render terrarium components when user is given', () => {
    const elProfile = ngMocks.find('ltm-profile');
    const elLocations = ngMocks.find('ltm-location-list');
    const elPlants = ngMocks.find('ltm-plant-list');

    expect(component.user$).toBeTruthy();
    expect(elProfile).toBeDefined();
    expect(elLocations).toBeDefined();
    expect(elPlants).toBeDefined();
  });
});
