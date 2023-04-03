import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Photo } from '@models/photo.model';
import { ImagePathService } from '@services/image-path.service';
import { ImagePath } from '@models/image-path.model';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

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
  @Input() list: Photo[] = [];
  list$ = new BehaviorSubject<Photo[]>([]);

  constructor(
    private imagePath: ImagePathService
  ) {}

  ngOnInit(): void {
    this.list$.next(this.list);
   }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['list'].currentValue !== changes['list'].previousValue) {
      this.list$.next(changes['list'].currentValue);
    }
  }

  getThumb(path: ImagePath): string | null {
    return this.imagePath.get(path, 'thumb');
  }
}
