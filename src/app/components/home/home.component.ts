import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule,
    LocationListComponent,
    SigninComponent,
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor(
    public auth: AuthService,
    private mt: MainToolbarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.auth.signedIn$.subscribe((isSigned: boolean) => {
      if (isSigned) {
        this.translate.get('general.locations').subscribe((res: string) => {
          this.mt.setName(res);
        });
        this.mt.setButtons([]);
        this.mt.setMenu([]);
      }
      else this.mt.hide();
    })
  }

}
