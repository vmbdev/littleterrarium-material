import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { CameraService } from '@services/camera/camera.service';
import { DeviceService } from '@services/device/device.service';
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
export class FileUploaderComponent implements ControlValueAccessor {
  private readonly camera = inject(CameraService);
  private readonly device = inject(DeviceService);

  /**
   * Max amount of files the user can select. By default, 1.
   */
  maxAmount = input(1, { transform: numberAttribute });

  /**
   * Special mode in which the file uploader design changes to fill a circular
   * container.
   */
  embedded = input(false, { transform: booleanAttribute });
  embeddedSize = input(0, { transform: numberAttribute });

  /**
   * Emitted when the files selected in the component have changed.
   * In case we don't want to use this component as a FormControl.
   */
  fileChange = output<File[] | File>();

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
   * of files allowed. We can't detect changes on files length so it can't be
   * computed.
   */
  protected $availableSlots: WritableSignal<number> = signal(
    this.maxAmount() - this.$files().length,
  );

  /**
   * Mouse is over the component containing a file.
   */
  protected dragOver: boolean = false;

  protected $mobileOS = toSignal(
    this.device.getOS().pipe(map((os) => os === 'android' || os === 'ios')),
  );

  private onChange = (val: File[] | File | null) => {};

  writeValue(val: File[]): void {
    if (val) {
      this.$files.set([]);
      this.addFiles(val);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

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
      this.$availableSlots.set(this.maxAmount() - this.$files().length);

      if (this.maxAmount() === 1) {
        this.onChange(this.$files()[0]);
        this.fileChange.emit(this.$files()[0]);
      } else {
        this.onChange(this.$files());
        this.fileChange.emit(this.$files());
      }
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
    this.$availableSlots.set(this.maxAmount() - this.$files().length);

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
