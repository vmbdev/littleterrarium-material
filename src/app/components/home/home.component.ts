import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import {
  LocationListComponent
} from '@components/location/location-list/location-list.component';
import { SigninComponent } from '@components/user/signin/signin.component';
import { AuthService } from '@services/auth.service';
import { MainToolbarService } from '@services/main-toolbar.service';

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
  constructor(
    public readonly auth: AuthService,
    private readonly mt: MainToolbarService,
    private readonly translate: TranslocoService
  ) {}

  ngOnInit(): void {
    this.translate.selectTranslate('general.locations')
      .subscribe((res: string) => {
        this.mt.setName(res);
      });
    this.mt.setButtons([]);
    this.mt.setMenu([]);
  }
}
