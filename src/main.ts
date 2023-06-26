import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { importProvidersFrom, isDevMode } from "@angular/core";
import { bootstrapApplication, HammerModule, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { DateAdapter, NativeDateAdapter } from "@angular/material/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToastrModule } from "ngx-toastr";
import 'hammerjs';

import { AuthInterceptor } from "@interceptors/auth.interceptor";
import { ErrorHandlerInterceptor } from "@interceptors/error-handler.interceptor";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/routes";
import { baseUrlDevelopment, baseUrlProduction } from "@config";
import { BACKEND_URL } from "./tokens";
import { LTHammerConfig } from "./config.hammerjs";

export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: BACKEND_URL, useValue: isDevMode() ? baseUrlDevelopment : baseUrlProduction },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: HAMMER_GESTURE_CONFIG, useClass: LTHammerConfig },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(HammerModule),
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    importProvidersFrom(ToastrModule.forRoot()),

  ]
}).catch(err => console.error(err));
