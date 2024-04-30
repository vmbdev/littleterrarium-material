import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { App } from '@capacitor/app';

import { AuthService } from '@services/auth/auth.service';
import { LanguageService } from '@services/language/language.service';

@Component({
  selector: 'ltm-app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterModule, MatNativeDateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly location = inject(Location);
  private readonly auth = inject(AuthService);
  private readonly language = inject(LanguageService);

  ngOnInit() {
    this.auth.check().subscribe({
      complete: () => {
        this.language.init();
      },
    });

    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) this.location.back();
      else App.exitApp();
    });
  }
}
