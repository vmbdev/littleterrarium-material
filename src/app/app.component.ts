import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreModule } from './modules/core/core.module';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        CommonModule,
        RouterModule,
        CoreModule
    ]
})
export class AppComponent {

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('es');
  }
}
