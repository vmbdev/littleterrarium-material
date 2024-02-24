import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { App } from '@capacitor/app';

import { LangService } from '@services/lang.service';

@Component({
  selector: 'ltm-app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterModule, MatNativeDateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private readonly location: Location,
    private readonly langService: LangService,
  ) {}

  ngOnInit() {
    this.langService.load();

    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) this.location.back();
      else App.exitApp();
    });
  }
}
