import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { App } from '@capacitor/app';
import { MatNativeDateModule } from '@angular/material/core';
import { CoreModule } from './modules/core/core.module';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
      CommonModule,
      RouterModule,
      CoreModule,
      MatNativeDateModule
    ]
})
export class AppComponent {

  constructor(private location: Location) { }

  ngOnInit() {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) this.location.back();
      else App.exitApp();
    })
  }
}
