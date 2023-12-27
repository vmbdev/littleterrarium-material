import { MockBuilder } from 'ng-mocks';
import { TranslocoService } from '@ngneat/transloco';
import { ThemeSwitcherComponent } from './theme-switcher.component';

describe('ThemeSwitcherComponent', () => {
  beforeEach(async () => {
    return MockBuilder(ThemeSwitcherComponent).mock(TranslocoService);
  });

  it('should create', () => {
    const component = ThemeSwitcherComponent;
    expect(component).toBeTruthy();
  });
});
