import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { TranslocoModule } from '@ngneat/transloco';

import { LocationEditComponent } from '@components/location/location-edit/location-edit.component';
import { Location } from '@models/location.model';
import { getTranslocoModule } from 'src/app/tests/transloco.module';
import { ErrorHandlerService } from '@services/error-handler/error-handler.service';

describe('LocationEditComponent', () => {
  let component: LocationEditComponent;
  let fixture: MockedComponentFixture;
  const testLocation = {
    id: 0,
    name: 'Test location',
    light: 'SHADE',
    public: true,
    ownerId: 0,
    _count: { plants: 5 },
  } as Location;

  beforeEach(() =>
    MockBuilder([LocationEditComponent, TranslocoModule])
      .mock(ErrorHandlerService)
      .provide(getTranslocoModule().providers ?? [])
  );

  beforeEach(() => {
    fixture = MockRender(LocationEditComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
