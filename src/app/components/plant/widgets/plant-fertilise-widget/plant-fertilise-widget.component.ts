import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'plant-fertilise-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './plant-fertilise-widget.component.html',
  styleUrls: ['./plant-fertilise-widget.component.scss']
})
export class PlantFertiliseWidgetComponent {

}
