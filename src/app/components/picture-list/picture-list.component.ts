import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PictureItem } from '@models/picture-item.model';
import { SortOptions } from '@models/sort-options.model';
import { PictureBoxComponent } from '@components/picture-box/picture-box.component';

@Component({
  selector: 'picture-list',
  standalone: true,
  imports: [
    CommonModule,
    PictureBoxComponent,
  ],
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss']
})
export class PictureListComponent {
  @Input() createAddItem: boolean = false;
  @Input() addItemLink?: string | any[];
  @Input() list: PictureItem[] = [];
  @Input() contentBelow: boolean = false;
  @Input() sortOrder: SortOptions = 'asc';
  @Input() sortBy: string = 'name';
  @Input() filterText?: string;
  @Input() detailed: boolean = false;
}
