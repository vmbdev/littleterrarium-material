import { MockBuilder } from 'ng-mocks';
import { CoreModule } from '../core.module';

import { LangSwitcherComponent } from './lang-switcher.component';

describe('LangSwitcherComponent', () => {
  beforeEach(() => {
    return MockBuilder(LangSwitcherComponent, CoreModule);
  });

  it('should create', () => {
    const component = LangSwitcherComponent;
    expect(component).toBeTruthy();
  });
});
