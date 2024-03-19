import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { TranslocoModule } from '@ngneat/transloco';
import { EMPTY, of } from 'rxjs';

import { LocationListComponent } from '@components/location/location-list/location-list.component';
import { Location } from '@models/location.model';
import { getTranslocoModule } from 'src/app/tests/transloco.module';
import { ErrorHandlerService } from '@services/error-handler/error-handler.service';
import { LocationService } from '@services/location/location.service';

fdescribe('LocationListComponent', () => {
  let component: LocationListComponent;
  let fixture: MockedComponentFixture;
  const locations: Location[] = [
    {
      id: 0,
      name: 'Test location',
      light: 'SHADE',
      public: true,
      ownerId: 0,
      _count: { plants: 5 },
    } as Location, {
      id: 1,
      name: 'Test location 2',
      light: 'FULLSUN',
      public: false,
      ownerId: 0,
      _count: { plants: 0 },
    } as Location,
  ]

  beforeEach(() =>
    MockBuilder([LocationListComponent, TranslocoModule])
      .mock(ErrorHandlerService)
      .provide(getTranslocoModule().providers ?? [])
      .mock(LocationService, {
        getMany: () => of(locations),
        delete: () => of(EMPTY)
      })
  );

  beforeEach(() => {
    fixture = MockRender(LocationListComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
