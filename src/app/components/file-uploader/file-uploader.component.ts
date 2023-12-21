import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBaseComponent } from '@components/form-base/form-base.component';
import { TranslocoModule } from '@ngneat/transloco';

import { ShortFilenamePipe } from '@pipes/short-filename/short-filename.pipe';

@Component({
  standalone: true,
  selector: 'ltm-file-uploader',
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ShortFilenamePipe,
  ],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements FormBaseComponent {
  /**
   * Max amount of files the user can select. By default, 1.
   */
  @Input({ transform: numberAttribute }) maxAmount: number = 1;

  /**
   * Whether the uploader will show a "remove current photo" checkbox
   */
  @Input({ transform: booleanAttribute }) removable: boolean = false;

  /**
   * Emitted when the files selected in the component have changed.
   */
  @Output() fileChange: EventEmitter<File[]> = new EventEmitter<File[]>();

  form = this.fb.group({ remove: [this.removable] });

  /**
   * Files currently selected in the component.
   */
  files: File[] = [];

  /**
   * Thumbnails for the current file selection, in the same order.
   */
  previews: string[] = new Array<string>(this.maxAmount);

  /**
   * Mouse is over the component containing a file.
   */
  dragOver: boolean = false;


  constructor(private readonly fb: FormBuilder) {}

  /**
   * Mouse is dragging a file over the component.
   *
   * @param {DragEvent} event  The drag and drop event.
   */
  dragEnter(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.dragOver && this.availableSlots() > 0) this.dragOver = true;
  }

  /**
   * Mouse left the component.
   *
   * @param {DragEvent} event  The drag and drop event.
   */
  dragLeave(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.dragOver) this.dragOver = false;
  }

  /**
   * A file was dropped over the component, containing one or more files.
   *
   * @param {DragEvent} event  The drag and drop event.
   */
  dropFile(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer?.files;

    this.dragOver = false;

    if (files) this.addFiles(files);
  }

  /**
   * One or more files have been manually selected by the user.
   *
   * @param {Event} event  The input event.
   */
  fileInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (target.files) this.addFiles(target.files);
  }

  /**
   * The number of files that can still be added, depending on the max amount
   * of files allowed.
   *
   * @returns {number} The difference between maxAmount and the number of files
   * already selected.
   */
  availableSlots(): number {
    return this.maxAmount - this.files.length;
  }

  /**
   * Add files to the current selection. Called when the user drags and drop
   * or selects more files.
   *
   * @param {FileList} list  The list of files to be added.
   */
  addFiles(list: FileList): void {
    const slots = this.availableSlots();

    if (slots > 0) {
      const limit = list.length > slots ? slots : list.length;
      const base = this.files.length;

      this.files.push(...Array.from(list).splice(0, slots));

      // previews array must follow the same order as files array
      for (let i = base; i < base + limit; i++) {
        this.previews[i] = URL.createObjectURL(this.files[i]);
      }

      this.fileChange.emit(this.files);
    }
  }

  /**
   * Removes a file from the current selection.
   *
   * @param {number} index  The index of the file to be removed.
   */
  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
  }

  /**
   * Revokes an URL object to free memory after the thumbnail for the preview
   * has been rendered.
   *
   * @param url
   */
  revokeUrl(url: string) {
    URL.revokeObjectURL(url);
  }
}
