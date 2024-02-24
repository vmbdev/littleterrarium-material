import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  WriteFileResult,
  Filesystem,
  DeleteFileOptions,
  WriteFileOptions,
} from '@capacitor/filesystem';
import { Observable, from, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilesystemService {
  constructor(private readonly http: HttpClient) {}

  fetchFile(path: string): Observable<Blob> {
    return this.http.get(path, { responseType: 'blob' });
  }

  writeFile(
    path: string,
    data: string | Blob,
    options?: Partial<WriteFileOptions>,
  ): Observable<WriteFileResult> {
    return from(Filesystem.writeFile({ path, data, ...options }));
  }

  deleteFile(
    path: string,
    options?: Partial<DeleteFileOptions>,
  ): Observable<void> {
    return from(Filesystem.deleteFile({ path, ...options }));
  }

  getBase64FromFile(blob: Blob): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(blob);
    reader.onload = (event: ProgressEvent<FileReader>) =>
      result.next(btoa(event.target!.result!.toString()));

    return result;
  }
}
