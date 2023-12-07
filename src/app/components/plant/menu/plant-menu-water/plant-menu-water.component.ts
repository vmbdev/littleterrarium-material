import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import {
  PlantBaseActionComponent
} from '@components/plant/plant-base-action/plant-base-action.component';

@Component({
  selector: 'ltm-plant-menu-water',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
  ],
  templateUrl: './plant-menu-water.component.html',
})
export class PlantMenuWaterComponent extends PlantBaseActionComponent {}
