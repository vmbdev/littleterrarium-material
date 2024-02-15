import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { PlantService } from '@services/plant.service';
import { Photo } from '@models/photo.model';
import { SortPipe } from '@pipes/sort/sort.pipe';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'ltm-photo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SortPipe,
    ImagePathPipe,
    TranslocoModule,
  ],
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss'],
})
export class PhotoListComponent {
  @Input({ required: true }) plantId?: number;
  @Input() owned: boolean = true;
  protected list$?: Observable<Photo[]>;

  constructor(private readonly plantService: PlantService) {}

  ngOnInit(): void {
    if (this.plantId) {
      this.list$ = this.plantService.getPhotos(this.plantId);
    }
  }
}
