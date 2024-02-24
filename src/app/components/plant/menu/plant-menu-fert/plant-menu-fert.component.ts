import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';

import { PlantService } from '@services/plant.service';

@Component({
  selector: 'ltm-plant-menu-fert',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslocoModule,
  ],
  templateUrl: './plant-menu-fert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantMenuFertComponent {
  public readonly id = input.required<number>();
  protected readonly plantService = inject(PlantService);
}
