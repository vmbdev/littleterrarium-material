import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo as CapPhoto,
  GalleryImageOptions,
  GalleryPhotos,
  ImageOptions,
} from '@capacitor/camera';
import {
  from,
  switchMap,
  map,
  Observable,
  withLatestFrom,
  mergeMap,
  forkJoin,
} from 'rxjs';

import { FilesystemService } from '@services/filesystem.service';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor(private readonly filesystem: FilesystemService) {}

  capture(options?: ImageOptions): Observable<File> {
    // we capture the photo from the camera
    const camera$ = from(
      Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        ...options,
      }),
    );

    // then we fetch the file from the filesystem
    const blob$ = camera$.pipe(
      mergeMap((capturedImg: CapPhoto) =>
        this.filesystem.fetchFile(capturedImg.webPath!),
      ),
    );

    return forkJoin([camera$, blob$]).pipe(
      // then we delete the photo from the filesystem
      switchMap(([camera]) => this.filesystem.deleteFile(camera.path!)),
      withLatestFrom(blob$),
      // and finally we made the photo available as a File
      map(
        ([, blob]) =>
          new File([blob], Date.now().toString(), { type: blob.type }),
      ),
    );
  }

  pickFromGallery(options?: GalleryImageOptions): Observable<File[]> {
    // pick the photos from the gallery
    const camera$ = from(
      Camera.pickImages({
        quality: 90,
        ...options,
      }),
    );

    // then we fetch them from the filesystem
    const gallery$ = camera$.pipe(
      switchMap((gallery: GalleryPhotos) => {
        const paths: Observable<Blob>[] = [];

        for (let photo of gallery.photos) {
          paths.push(this.filesystem.fetchFile(photo.webPath));
        }

        return forkJoin(paths);
      }),
    );

    // then we delete them from the filesystem
    return forkJoin([camera$, gallery$]).pipe(
      switchMap(([gallery]) => {
        const paths: Observable<void>[] = [];

        for (let photo of gallery.photos) {
          if (photo.path) paths.push(this.filesystem.deleteFile(photo.path));
        }

        return forkJoin(paths);
      }),
      withLatestFrom(gallery$),
      // and then we create the files to be made available
      map(([, blobs]) => {
        const files: File[] = [];

        for (const blob of blobs) {
          files.push(
            new File([blob], Date.now().toString(), { type: blob.type }),
          );
        }

        return files;
      }),
    );
  }
}