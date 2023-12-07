import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { App } from '@capacitor/app';

import { NavigationComponent } from '@components/navigation/navigation/navigation.component';

@Component({
  selector: 'ltm-app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    RouterModule,
    NavigationComponent,
    MatNativeDateModule,
  ],
})
export class AppComponent {
  constructor(private location: Location) {}

  ngOnInit() {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) this.location.back();
      else App.exitApp();
    });
  }
}
