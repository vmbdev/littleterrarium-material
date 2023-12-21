import { MockBuilder } from 'ng-mocks';

import { LangSwitcherComponent } from './lang-switcher.component';

describe('LangSwitcherComponent', () => {
  beforeEach(() => {
    return MockBuilder(LangSwitcherComponent);
  });

  it('should create', () => {
    const component = LangSwitcherComponent;
    expect(component).toBeTruthy();
  });
});
