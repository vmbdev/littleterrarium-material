import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';

@Component({
  selector: 'ltm-plant-all',
  standalone: true,
  imports: [PlantListComponent, TranslocoModule],
  templateUrl: './plant-all.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class PlantAllComponent {
  private readonly mt = inject(MainToolbarService);
  private readonly translate = inject(TranslocoService);

  ngOnInit(): void {
    this.mt.setName(this.translate.translate('general.plants'));
    this.mt.setButtons([]);
    this.mt.setMenu([]);
  }
}
