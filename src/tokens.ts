import { InjectionToken } from '@angular/core';

import { ViewerData } from '@models/viewer.model';

export const BACKEND_URL = new InjectionToken<string>('BACKEND_URL');
export const FRONTEND_URL = new InjectionToken<string>('FRONTEND_URL');
export const VIEWER_DATA = new InjectionToken<ViewerData>('VIEWER_DATA');
