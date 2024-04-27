import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import {
  LocationListComponent
} from '@components/location/location-list/location-list.component';
import { SigninComponent } from '@components/user/signin/signin.component';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';

@Component({
  selector: 'ltm-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    LocationListComponent,
    SigninComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly translate = inject(TranslocoService);
  private readonly mt = inject(MainToolbarService);

  ngOnInit(): void {
    this.mt.setName(this.translate.translate('general.locations'));
    this.mt.setButtons([]);
    this.mt.setMenu([]);
  }
}
