import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

import { TranslateModule } from '@ngx-translate/core';

import { MainToolbarComponent } from '@modules/core/main-toolbar/main-toolbar.component';
import { NavigationComponent } from '@modules/core/navigation/navigation.component';
import { BottomToolbarComponent } from '@modules/core/bottom-toolbar/bottom-toolbar.component';
import { LangSwitcherComponent } from '@modules/core/lang-switcher/lang-switcher.component';
import { SearchComponent } from '@modules/core/search/search.component';
import { UserBoxComponent } from '@modules/core/user-box/user-box.component';

@NgModule({
  declarations: [
    NavigationComponent,
    MainToolbarComponent,
    BottomToolbarComponent,
    LangSwitcherComponent,
    UserBoxComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatSelectModule,
    MatDividerModule,
    
    TranslateModule,
    SearchComponent
  ],
  exports: [
    NavigationComponent
  ]
})
export class CoreModule { }
