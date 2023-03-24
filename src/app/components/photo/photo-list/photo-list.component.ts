import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Photo } from '@models/photo.model';
import { ImagePathService } from '@services/image-path.service';
import { ImagePath } from '@models/image-path.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'photo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent {
  @Input() plantId?: number;
  @Input() owned: boolean = true;
  @Input() list?: Photo[];

  constructor(
    private imagePath: ImagePathService
  ) {}

  ngOnInit(): void { }

  getThumb(path: ImagePath): string | null {
    return this.imagePath.get(path, 'thumb');
  }
}
