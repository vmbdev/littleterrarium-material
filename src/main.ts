import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AuthInterceptor } from "@interceptors/auth.interceptor";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/routes";


bootstrapApplication(AppComponent, {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimations(),
    importProvidersFrom(RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })),
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));
