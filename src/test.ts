import { EventEmitter } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ngMocks } from "ng-mocks";
import { of } from "rxjs";
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BACKEND_URL } from "./tokens";

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

ngMocks.autoSpy('jasmine');

ngMocks.defaultMock(TranslateService, () => ({
  currentLang: 'en',
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter(),
  isLoadedSubject: of(true),
  get: (key: any) => of(key),
  instant: (key: string) => key
}));
ngMocks.defaultMock(MAT_DIALOG_DATA, () => { return {} } );
ngMocks.defaultMock(BACKEND_URL, () => 'http://localhost:5000');