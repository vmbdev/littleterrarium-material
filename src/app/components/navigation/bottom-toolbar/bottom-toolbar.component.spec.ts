import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';
import { BottomToolbarComponent } from './bottom-toolbar.component';
import { TaskService } from '@services/task.service';

describe('BottomToolbarComponent', () => {
  let component: BottomToolbarComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder(BottomToolbarComponent).mock(TaskService, {
      getCount: () => 5,
    })
  );

  beforeEach(() => {
    fixture = MockRender(BottomToolbarComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidenave when clicked', () => {
    const el = ngMocks.find(['data-testid', 'toggleSidenavButton']);
    const toggle = spyOn(component.toggleSidenav, 'emit');
    ngMocks.click(el);

    expect(toggle).toHaveBeenCalled();
  });
});
