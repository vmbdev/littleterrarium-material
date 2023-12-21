import { ngMocks } from "ng-mocks";
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
ngMocks.defaultMock(MAT_DIALOG_DATA, () => { return {} } );
ngMocks.defaultMock(BACKEND_URL, () => 'http://localhost:5000');