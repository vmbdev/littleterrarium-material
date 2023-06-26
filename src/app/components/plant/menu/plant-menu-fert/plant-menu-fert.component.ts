import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PlantBaseActionComponent } from '@components/plant/plant-base-action/plant-base-action.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'plant-menu-fert',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule
  ],
  templateUrl: './plant-menu-fert.component.html',
  styleUrls: ['./plant-menu-fert.component.scss']
})
export class PlantMenuFertComponent extends PlantBaseActionComponent {

}
