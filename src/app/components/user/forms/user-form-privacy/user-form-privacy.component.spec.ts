import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MockBuilder } from 'ng-mocks';

import { UserFormPrivacyComponent } from './user-form-privacy.component';

describe('UserFormPrivacyComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserFormPrivacyComponent);
  });

  it('should create', () => {
    const component = UserFormPrivacyComponent;
    expect(component).toBeTruthy();
  });
});
