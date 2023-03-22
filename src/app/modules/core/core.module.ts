import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BottomToolbarComponent } from './bottom-toolbar/bottom-toolbar.component';

@NgModule({
  declarations: [
    NavigationComponent,
    MainToolbarComponent,
    BottomToolbarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [
    NavigationComponent
  ]
})
export class CoreModule { }
