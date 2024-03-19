import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  forwardRef,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { CameraService } from '@services/camera.service';
import { ShortFilenamePipe } from '@pipes/short-filename/short-filename.pipe';

@Component({
  standalone: true,
  selector: 'ltm-file-uploader',
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    ShortFilenamePipe,
  ],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent {
  private readonly camera = inject(CameraService);

  /**
   * Max amount of files the user can select. By default, 1.
   */
  maxAmount = input(1, { transform: numberAttribute });

  protected disabled: boolean = false;

  /**
   * Files currently selected in the component.
   */
  protected $files: WritableSignal<File[]> = signal([]);

  /**
   * Thumbnails for the current file selection, in the same order.
   */
  protected $previews: WritableSignal<string[]> = signal([]);

  /**
   * The number of files that can still be added, depending on the max amount
   * of files allowed.
   */
  protected $availableSlots = computed(
    () => this.maxAmount() - this.$files().length,
  );

  /**
   * Mouse is over the component containing a file.
   */
  protected dragOver: boolean = false;

  private onChange = (val: File[] | File | null) => {};
  private onTouched = () => {};

  writeValue(val: File[]): void {
    if (val) this.onChange(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Mouse is dragging a file over the component.
   *
   * @param {DragEvent} event  The drag and drop event.
   */
  dragEnter(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.dragOver && this.$availableSlots() > 0) this.dragOver = true;
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
   * One or more files were dropped over the component.
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
   * Add files to the current selection. Called when the user drags and drop
   * or selects more files.
   *
   * @param {FileList | File[]} list  The list of files to be added.
   */
  addFiles(list: FileList | File[]): void {
    if (this.$availableSlots() > 0) {
      const limit =
        list.length > this.$availableSlots()
          ? this.$availableSlots()
          : list.length;
      const base = this.$files().length;
      const previews: string[] = [];

      this.$files.update((val) => [
        ...val,
        ...Array.from(list).splice(0, this.$availableSlots()),
      ]);

      // previews array must follow the same order as files array
      for (let i = base; i < base + limit; i++) {
        previews.push(URL.createObjectURL(this.$files()[i]));
      }

      this.$previews.update((val) => [...val, ...previews]);

      if (this.maxAmount() === 1) {
        this.onChange(this.$files()[0]);
      } else this.onChange(this.$files());
    }
  }

  captureFromCamera() {
    this.camera.capture().subscribe((file: File) => {
      this.addFiles([file]);
    });
  }

  pickFromGallery() {
    this.camera.pickFromGallery().subscribe((files: File[]) => {
      this.addFiles(files);
    });
  }

  /**
   * Removes a file from the current selection.
   *
   * @param {number} index  The index of the file to be removed.
   */
  removeFile(index: number): void {
    this.$files.update((val) => {
      const newVal = val;

      newVal.splice(index, 1);
      return newVal;
    });
    this.$previews.update((val) => {
      const newVal = val;

      newVal.splice(index, 1);
      return newVal;
    });

    if (this.maxAmount() === 1) {
      this.onChange(null);
    } else this.onChange(this.$files());
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
