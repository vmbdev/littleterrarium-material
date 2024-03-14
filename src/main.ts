import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_INITIALIZER, importProvidersFrom, isDevMode } from '@angular/core';
import {
  bootstrapApplication,
  HammerModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { TranslocoService, provideTransloco } from '@ngneat/transloco';
import { provideTranslocoPersistLang } from '@ngneat/transloco-persist-lang';
import { ToastrModule } from 'ngx-toastr';
import 'hammerjs';

import { AuthInterceptor } from '@interceptors/auth.interceptor';
import { ErrorHandlerInterceptor } from '@interceptors/error-handler.interceptor';
import { TranslocoHttpLoader, preloadLanguage } from './transloco-loader';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { BACKEND_URL } from './tokens';
import { LTHammerConfig } from './config.hammerjs';
import {
  baseUrlDevelopment,
  baseUrlProduction,
  availableLangs,
  defaultLang,
} from '@config';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: BACKEND_URL,
      useValue: isDevMode() ? baseUrlDevelopment : baseUrlProduction,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(HammerModule),
    { provide: HAMMER_GESTURE_CONFIG, useClass: LTHammerConfig },
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(ToastrModule.forRoot()),
    provideTranslocoPersistLang({
      storage: { useValue: localStorage },
      storageKey: 'LT_locale',
    }),
    provideTransloco({
      config: {
        availableLangs,
        defaultLang,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: preloadLanguage,
      multi: true,
      deps: [TranslocoService],
    },
  ],
}).catch((err) => console.error(err));
