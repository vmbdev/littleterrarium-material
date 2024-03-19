import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { ProfileComponent } from '@components/user/profile/profile.component';
import { LocationListComponent } from '@components/location/location-list/location-list.component';
import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';
import { ApiService } from '@services/api/api.service';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';
import { ShareService } from '@services/share/share.service';
import { User } from '@models/user.model';
import { FRONTEND_URL } from 'src/tokens';

@Component({
  selector: 'ltm-terrarium',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProfileComponent,
    LocationListComponent,
    PlantListComponent,
  ],
  templateUrl: './terrarium.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerrariumComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslocoService);
  private readonly api = inject(ApiService);
  private readonly mt = inject(MainToolbarService);
  private readonly share = inject(ShareService);
  private readonly frontendUrl = inject(FRONTEND_URL);

  protected user$?: Observable<User>;

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');

    if (username) {
      this.user$ = this.api.getUserByName(username);

      this.mt.setMenu([
        [
          {
            icon: 'share',
            tooltip: 'general.share',
            click: () => {
              this.share.share({
                title: this.translate.translate('terrarium.shareTitle', {
                  user: username,
                }),
                text: this.translate.translate('terrarium.share'),
                url: `${this.frontendUrl}${this.router.url}`,
              });
            },
          },
        ],
      ]);
    }
  }
}
