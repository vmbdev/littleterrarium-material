import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
} from 'ng-mocks';

import { PropertyComponent } from './property.component';
import { TemplateRef } from '@angular/core';

describe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: MockedComponentFixture;

  beforeEach(() => MockBuilder(PropertyComponent));

  beforeEach(() => {
    fixture = MockRender(PropertyComponent, {
      icon: 'test',
      iconColor: 'blue',
    });
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the template', () => {
    expect(component.propertyTemplate).toEqual(jasmine.any(TemplateRef));
  });
});
