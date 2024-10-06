import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  importProvidersFrom,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { TranslocoService, provideTransloco } from '@ngneat/transloco';
import { ToastrModule } from 'ngx-toastr';

import { AuthInterceptor } from '@interceptors/auth.interceptor';
import { ErrorHandlerInterceptor } from '@interceptors/error-handler.interceptor';
import { TranslocoHttpLoader, preloadLanguage } from './transloco-loader';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { BACKEND_URL, FRONTEND_URL } from './tokens';
import {
  backendUrlDevelopment,
  backendUrlProduction,
  availableLangs,
  defaultLang,
  frontendUrlDevelopment,
  frontendUrlProduction,
} from '@config';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: BACKEND_URL,
      useValue: isDevMode() ? backendUrlDevelopment : backendUrlProduction,
    },
    {
      provide: FRONTEND_URL,
      useValue: isDevMode() ? frontendUrlDevelopment : frontendUrlProduction,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(ToastrModule.forRoot()),
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
      multi: true,
      useFactory: preloadLanguage,
      deps: [TranslocoService],
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (iconRegistry: MatIconRegistry) => () => {
        iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
      },
      deps: [MatIconRegistry],
    },
  ],
}).catch((err) => console.error(err));
