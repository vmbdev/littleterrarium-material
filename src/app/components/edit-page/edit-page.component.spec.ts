import { EditPageComponent } from './edit-page.component';
import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';
import { TranslocoModule } from '@ngneat/transloco';
import { getTranslocoModule } from 'src/app/tests/transloco.module';

describe('EditPageComponent', () => {
  let component: EditPageComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() =>
    MockBuilder([EditPageComponent, TranslocoModule])
      .provide(getTranslocoModule().providers ?? [])
  );

  beforeEach(() => {
    fixture = MockRender(EditPageComponent, {
      title: 'Test page',
    });
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept changes on click', () => {
    const spy = spyOn(fixture.point.componentInstance.accept, 'emit');
    const button = ngMocks.find(['data-testid', 'acceptChanges']);
    ngMocks.click(button);

    expect(spy).toHaveBeenCalled();
  })
});
