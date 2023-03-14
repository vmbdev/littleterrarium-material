import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'picture-box',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './picture-box.component.html',
  styleUrls: ['./picture-box.component.scss']
})
export class PictureBoxComponent {
  @Input() image?: string | null;
  @Input() title: string = '';
  @Input() contentBelow: boolean = false;
  @Input() add: boolean = false;
  @Input() link?: string | any[];
  
}
