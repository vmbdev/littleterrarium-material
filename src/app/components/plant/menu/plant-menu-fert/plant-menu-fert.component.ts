import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';

import {
  PlantBaseActionComponent
} from '@components/plant/plant-base-action/plant-base-action.component';

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
})
export class PlantMenuFertComponent extends PlantBaseActionComponent {}
