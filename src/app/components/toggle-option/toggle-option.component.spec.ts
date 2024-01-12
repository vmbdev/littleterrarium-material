import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { ToggleOptionComponent } from './toggle-option.component';

describe('ToggleOptionComponent', () => {
  let component: ToggleOptionComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() => 
    MockBuilder(ToggleOptionComponent)
  );

  beforeEach(() => {
    fixture = MockRender(ToggleOptionComponent, {
      checked: true
    });
    component = fixture.point.componentInstance;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change when clicked', () => {
    const change = spyOn(component.change, 'emit');
    const el = ngMocks.find('mat-card-content');
    ngMocks.click(el);

    expect(component.currentlyChecked).toBeFalse();
    expect(change).toHaveBeenCalledWith(false);
  })
});
