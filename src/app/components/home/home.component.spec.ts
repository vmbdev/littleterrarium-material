import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';

import { HomeComponent } from './home.component';
import { TranslocoModule } from '@ngneat/transloco';
import { getTranslocoModule } from 'src/app/tests/transloco.module';
import { AuthService } from '@services/auth/auth.service';
import { ApiService } from '@services/api/api.service';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder([HomeComponent, TranslocoModule])
      .provide(getTranslocoModule().providers ?? [])
      .provide(MainToolbarService)
      .mock(ApiService)
      .mock(AuthService, {
        signedIn$: of(true),
        checked$: of(true),
      })
  );

  beforeEach(() => {
    fixture = MockRender(HomeComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render location list when signed in', () => {
    const el = ngMocks.find('ltm-location-list');

    expect(el).toBeTruthy();
  });

  it('should render sign in component when not signed in', () => {
    const auth = ngMocks.get(AuthService);
    ngMocks.stubMember(auth, 'signedIn$', of(false));
    fixture.detectChanges();

    const el = ngMocks.find('ltm-signin');

    expect(el).toBeTruthy();
  });
});
