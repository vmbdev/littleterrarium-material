import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  SearchComponent
} from '@components/navigation/search/search.component';
import { MainToolbarService } from '@services/main-toolbar.service';
import { SearchService } from '@services/search.service';

@Component({
  selector: 'ltm-main-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonModule,
    TranslateModule,
    RouterModule,
    SearchComponent,
  ],
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent {

  constructor(
    public mt: MainToolbarService,
    public search: SearchService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
}