import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  PlantListComponent
} from '@components/plant/plant-list/plant-list.component';
import { MainToolbarService } from '@services/main-toolbar.service';

@Component({
  selector: 'ltm-plant-all',
  standalone: true,
  imports: [
    PlantListComponent,
    TranslateModule
  ],
  templateUrl: './plant-all.component.html'
})
export class PlantAllComponent {
  constructor(
    private mt: MainToolbarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.get('general.plants').subscribe((res: string) => {
      this.mt.setName(res);
    });
    this.mt.setButtons([]);
    this.mt.setMenu([]);
  }
}
