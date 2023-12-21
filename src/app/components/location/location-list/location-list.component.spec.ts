import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { of } from 'rxjs';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';

import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ImagePathService } from '@services/image-path.service';
import { LocationService } from '@services/location.service';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { FabComponent } from '@components/fab/fab.component';

import { LocationListComponent } from './location-list.component';

describe('LocationListComponent', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LocationListComponent,
        MatDialogModule,
        ...MockComponents(FabComponent, WaitDialogComponent)
      ],
      providers: [
        MockProvider(LocationService, {
          getMany: () => of([])
        }),
        ...MockProviders(
          AuthService,
          ImagePathService,
          ErrorHandlerService,
          TranslocoService
        ),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
