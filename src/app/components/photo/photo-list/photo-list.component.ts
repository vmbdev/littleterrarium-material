import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable } from 'rxjs';

import { PlantService } from '@services/plant/plant.service';
import { Photo } from '@models/photo.model';
import { SortPipe } from '@pipes/sort/sort.pipe';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'ltm-photo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    SortPipe,
    ImagePathPipe,
    TranslocoModule,
  ],
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoListComponent {
  private readonly plantService = inject(PlantService);

  plantId = input<number>();
  grid = viewChild<ElementRef>('grid');

  protected list$?: Observable<Photo[]>;
  protected breakpoint: number = 0;

  ngOnInit(): void {
    const plantId = this.plantId();

    if (plantId) {
      this.computeBreakpoint();
      this.list$ = this.plantService.getPhotos(plantId);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.computeBreakpoint();
  }

  computeBreakpoint() {
    const width = this.grid()?.nativeElement.clientWidth;

    if (width) {
      let cols: number;

      if (width <= 480) cols = 3;
      else if (width >= 1280) cols = 8;
      else cols = 5;

      this.breakpoint = width / cols;
    }
  }
}
