import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { SearchComponent } from '@components/navigation/search/search.component';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';
import { SearchService } from '@services/search/search.service';
import { FullWidthDirective } from '@directives/full-width/full-width.directive';

@Component({
  selector: 'ltm-main-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonModule,
    TranslocoModule,
    SearchComponent,
    FullWidthDirective,
  ],
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainToolbarComponent {
  protected readonly mt = inject(MainToolbarService);
  protected readonly search = inject(SearchService);
  private readonly location = inject(Location);

  @Output() toggleSidenav = new EventEmitter();

  emitToggleSidenav() {
    this.toggleSidenav.emit();
  }

  goBack(): void {
    this.location.back();
  }
}
