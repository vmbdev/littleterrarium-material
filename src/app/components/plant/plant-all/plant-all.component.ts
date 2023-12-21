import { Component } from '@angular/core';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import {
  PlantListComponent
} from '@components/plant/plant-list/plant-list.component';
import { MainToolbarService } from '@services/main-toolbar.service';

@Component({
  selector: 'ltm-plant-all',
  standalone: true,
  imports: [PlantListComponent, TranslocoModule],
  templateUrl: './plant-all.component.html',
})
export class PlantAllComponent {
  constructor(
    private mt: MainToolbarService,
    private translate: TranslocoService
  ) {}

  ngOnInit(): void {
    this.translate.selectTranslate('general.plants').subscribe((res: string) => {
      this.mt.setName(res);
    });
    this.mt.setButtons([]);
    this.mt.setMenu([]);
  }
}
