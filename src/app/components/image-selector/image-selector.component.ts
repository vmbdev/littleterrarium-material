import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  numberAttribute,
  output,
  signal,
  untracked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { ImageCropComponent } from '@components/image-crop/image-crop.component';

@Component({
  selector: 'ltm-image-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    ImageCropComponent,
    FileUploaderComponent,
  ],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSelectorComponent {
  source = input<string | null>(null);
  smallSize = input(200, { transform: numberAttribute });
  expandedSize = input(300, { transform: numberAttribute });
  disabled = input(false, { transform: booleanAttribute });
  selected = output<File | null>();

  private firstChange = true;
  
  protected $newSource = signal<File | null>(null);
  protected $editMode = signal(false);

  updateEditMode = effect(() => {
    if (this.firstChange && !this.source()) {
      untracked(() => {
        this.$editMode.set(true);
      });
    } else if (!this.firstChange && this.source()) {
      untracked(() => {
        this.$editMode.set(false);
        this.$newSource.set(null);
      });
    }
    
    this.firstChange = false;
  });

  edit() {
    this.$editMode.set(true);
    this.selected.emit(null);
  }

  getNewFile(file: File | File[]) {
    this.$newSource.set(file as File);
  }

  removeNewSource() {
    this.$newSource.set(null);
  }

  acceptNewSource() {
    if (this.$newSource()) this.selected.emit(this.$newSource());
  }

  fetchNewSource(file: File) {
    this.$newSource.set(file);
  }
}
