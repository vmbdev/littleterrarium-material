import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Photo } from '@models/photo.model';
import { ImagePathService } from '@services/image-path.service';
import { ImagePath } from '@models/image-path.model';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PlantService } from '@services/plant.service';
import { SortPipe } from "@pipes/sort/sort.pipe";

@Component({
    selector: 'photo-list',
    standalone: true,
    templateUrl: './photo-list.component.html',
    styleUrls: ['./photo-list.component.scss'],
    imports: [
      CommonModule,
      RouterModule,
      SortPipe
    ]
})
export class PhotoListComponent {
  @Input({ required: true }) plantId?: number;
  @Input() owned: boolean = true;
  list$ = new BehaviorSubject<Photo[]>([]);

  constructor(
    private imagePath: ImagePathService,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    if (this.plantId) {
      this.plantService.getPhotos(this.plantId).subscribe((photos: Photo[]) => {
        this.list$.next(photos);
      });
    }
  }

  getThumb(path: ImagePath): string | null {
    return this.imagePath.get(path, 'thumb');
  }
}
