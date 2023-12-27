import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';
import { Share, ShareOptions, ShareResult } from '@capacitor/share';
import { Observable, ReplaySubject, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(private readonly http: HttpClient) {}

  getBase64FromFile(blob: Blob): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(blob);
    reader.onload = (event: ProgressEvent<FileReader>) =>
      result.next(btoa(event.target!.result!.toString()));

    return result;
  }

  shareImageFromURL(image: string, text?: string): Observable<void> {
    const ext = image.substring(image.lastIndexOf('.'));

    return this.http.get(image, { responseType: 'blob' }).pipe(
      switchMap((res) => this.getBase64FromFile(res)),
      switchMap((base64data) => this.writeFile(ext, base64data)),
      switchMap((file) => this.share({ url: file.uri, text })),
      switchMap(() => this.deleteFile(ext))
    );
  }

  writeFile(fileExt: string, base64data: string): Observable<WriteFileResult> {
    return from(
      Filesystem.writeFile({
        path: `share-image.${fileExt}`,
        data: base64data,
        directory: Directory.Cache,
      })
    );
  }

  deleteFile(fileExt: string): Observable<void> {
    return from(
      Filesystem.deleteFile({
        directory: Directory.Cache,
        path: `share-image.${fileExt}`,
      })
    );
  }

  share(options: ShareOptions): Observable<ShareResult> {
    return from(Share.share(options));
  }
}
