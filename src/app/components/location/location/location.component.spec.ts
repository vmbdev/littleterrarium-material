import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { LocationComponent } from './location.component';
import { getTranslocoModule } from 'src/app/tests/transloco.module';
import { LocationService } from '@services/location.service';
import { Location } from '@models/location.model';

describe('LocationComponent', () => {
  let component: LocationComponent;
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
    MockBuilder([LocationComponent, TranslocoModule])
      .mock(LocationService, {
        location$: of(testLocation),
        get: () => of(testLocation),
        isOwned: () => true,
      })
      .provide(getTranslocoModule().providers ?? [])
      .provide({
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: convertToParamMap({
              locationId: '0',
            }),
          },
        },
      })
  );

  beforeEach(() => {
    fixture = MockRender(LocationComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show number of plants', () => {
    const el = ngMocks.find(['data-testid', 'countProperty']);
    
    expect(ngMocks.formatText(el)).toBe('5 plants');
  });

  it('should show no plants in the counter', () => {
    testLocation._count!.plants = 0;
    fixture.detectChanges();

    const el = ngMocks.find(['data-testid', 'countProperty']);
    
    expect(ngMocks.formatText(el)).toBe('No plants yet!');
  });
});
