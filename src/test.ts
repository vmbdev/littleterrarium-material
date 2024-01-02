import { ngMocks } from 'ng-mocks';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BACKEND_URL } from './tokens';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

ngMocks.autoSpy('jasmine');
ngMocks.defaultMock(MAT_DIALOG_DATA, () => {
  return {};
});
ngMocks.defaultMock(BACKEND_URL, () => 'http://localhost:5000');
// ngMocks.defaultMock(AuthService, () => ({
//   signedIn: MockService(BehaviorSubject<boolean>, of(true)),
//   checked: MockService(BehaviorSubject<boolean>, of(true)),
//   user: MockService(BehaviorSubject<User | null>, of(null)),
//   signedIn$: of(true),
//   checked$: of(true),
//   user$: of({
//     id: 0,
//     username: 'testusername',
//     password: 'testpassword',
//   } as User),
// }));
