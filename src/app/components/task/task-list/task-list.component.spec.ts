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

import { TaskListComponent } from './task-list.component';
import { TranslocoModule } from '@ngneat/transloco';
import { BehaviorSubject, of } from 'rxjs';

import { getTranslocoModule } from 'src/app/tests/transloco.module';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { MainToolbarService } from '@services/main-toolbar.service';
import { AuthService } from '@services/auth.service';
import { TaskService } from '@services/task.service';

class MockedComponent {}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: MockedComponentFixture;
  const testPlant = {
    id: 0,
    customName: 'Plant test',
    cover: {
      id: 0,
      images: { path: { thumb: 'http://test/cover.jpg' } },
    },
  } as Plant;

  beforeEach(() =>
    MockBuilder([
      TaskListComponent,
      TranslocoModule,
      RouterModule,
      RouterTestingModule.withRoutes([
        {
          path: 'plant/0',
          component: MockedComponent,
        },
      ]),
      NG_MOCKS_ROOT_PROVIDERS,
    ])
      .provide(getTranslocoModule().providers ?? [])
      .provide(MainToolbarService)
      .mock(AuthService, {
        signedIn$: of(true),
        checked$: of(true),
      })
      .mock<PlantService>(PlantService, {
        coverPhoto: (plant?: Plant) => testPlant.cover!.images.path.thumb,
        getVisibleName: (plant: Plant): string => testPlant.customName!,
      })
      .mock<TaskService>(TaskService, {
        count: 1,
        tasks: new BehaviorSubject<Plant[]>([testPlant]),
        tasks$: of([testPlant]),
        loadTasks: () => {},
      })
  );

  beforeEach(() => {
    fixture = MockRender(TaskListComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image cover', () => {
    const el = ngMocks.find('img');

    expect(el.attributes['matListItemAvatar']).toBeDefined();
    expect(el.nativeNode.src).toBe(testPlant.cover!.images.path.thumb);
  });

  it('should navigate on image cover click', fakeAsync(() => {
    const location: Location = fixture.point.injector.get(Location);
    const el = ngMocks.find('img');
    ngMocks.click(el);
    tick();

    expect(location.path()).toBe('/plant/0');
  }));

  it('should render the plant visible name', () => {
    const el = ngMocks.find('span');

    expect(el.attributes['matListItemTitle']).toBeDefined();
    expect(ngMocks.formatText(el.nativeNode.innerText)).toBe(
      testPlant.customName!
    );
  });

  it('should navigate when clicked on plant visible name', fakeAsync(() => {
    const location: Location = fixture.point.injector.get(Location);
    const el = ngMocks.find('span');
    ngMocks.click(el);
    tick();

    expect(location.path()).toBe('/plant/0');
  }));

  it('should render the action buttons', () => {
    const el = ngMocks.find('div.tasks__buttons');
    const waterButton = ngMocks.find('ltm-plant-button-water');
    const fertilizeButton = ngMocks.find('ltm-plant-button-fertilize');

    expect(el).toBeDefined();
    expect(waterButton).toBeDefined();
    expect(fertilizeButton).toBeDefined();
  })

  it('should render a no tasks message when there are none', () => {
    const ts = ngMocks.get(TaskService);
    ngMocks.stubMember(ts, 'tasks$', of([]));
    fixture.detectChanges();

    const el = ngMocks.find('mat-list-item.tasks__notasks');

    expect(el).toBeDefined();
  });
});
