import { Injectable, inject } from '@angular/core';
import { Share, ShareOptions, ShareResult } from '@capacitor/share';
import { Directory } from '@capacitor/filesystem';
import { Observable, from, switchMap } from 'rxjs';

import { FilesystemService } from '@services/filesystem.service';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private readonly filesystem = inject(FilesystemService);

  shareImageFromURL(image: string, text?: string): Observable<void> {
    const ext = image.substring(image.lastIndexOf('.'));

    return this.filesystem.fetchFile(image).pipe(
      switchMap((res) => this.filesystem.getBase64FromFile(res)),
      switchMap((base64data) =>
        this.filesystem.writeFile(`share-image.${ext}`, base64data, {
          directory: Directory.Cache,
        }),
      ),
      switchMap((file) => this.share({ url: file.uri, text })),
      switchMap(() =>
        this.filesystem.deleteFile(`share-image.${ext}`, {
          directory: Directory.Cache,
        }),
      ),
    );
  }

  share(options: ShareOptions): Observable<ShareResult> {
    return from(Share.share(options));
  }
}
