import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MockComponents, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { HomeComponent } from './home.component';
import { SigninComponent } from '@components/user/signin/signin.component';
import { LocationListComponent } from '@components/location/location-list/location-list.component';
import { User } from '@models/user.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        ...MockComponents(SigninComponent, LocationListComponent),
      ],
      providers: [
        MockProvider(AuthService, {
          signedIn$: of(true),
          checked$: of(true),
          user$: of({} as User)
        } ),
        MockProvider(TranslateService)
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
