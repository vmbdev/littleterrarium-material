import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';

import { InfoBoxComponent } from './info-box.component';

describe('InfoBoxComponent', () => {
  let component: InfoBoxComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() => MockBuilder(InfoBoxComponent));

  beforeEach(() => {
    fixture = MockRender(InfoBoxComponent, {
      description: 'Test description',
    });
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render description', () => {
    const el = ngMocks.find(fixture, 'div.info-box__description');

    expect(ngMocks.formatText(el.nativeNode.innerText)).toBe(
      'Test description'
    );
  });

  // it('should render property components', () => {
  //   const properties = [];

  //   properties.push(
  //     TestBed.createComponent(PropertyComponent).componentInstance
  //   );
  //   properties[0].icon = 'test';
  //   properties[0].iconColor = 'blue';

  //   component.properties.reset([...properties]);

  //   fixture.detectChanges();

  //   const el = ngMocks.find(fixture, 'mat-card-content.info-box__properties');
  //   console.log(el.children);

  //   const il = ngMocks.revealAll(fixture, '#prop');
  //   console.log(il);
  // });
});
