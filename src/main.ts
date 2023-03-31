import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { importProvidersFrom, isDevMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToastrModule } from "ngx-toastr";

import { AuthInterceptor } from "@interceptors/auth.interceptor";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/routes";
import { baseUrlDevelopment, baseUrlProduction } from "@config";

export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: 'BACKEND_URL', useValue: isDevMode() ? baseUrlDevelopment : baseUrlProduction },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })),
    importProvidersFrom(TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    importProvidersFrom(ToastrModule.forRoot())

  ]
}).catch(err => console.error(err));
