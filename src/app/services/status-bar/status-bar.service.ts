import { Injectable } from '@angular/core';
import { StatusBar, StatusBarInfo, StyleOptions } from '@capacitor/status-bar';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusBarService {
  show(): Observable<void> {
    return from(StatusBar.show());
  }

  hide(): Observable<void> {
    return from(StatusBar.hide());
  }

  getInfo(): Observable<StatusBarInfo> {
    return from(StatusBar.getInfo());
  }

  setStyle(options: StyleOptions): Observable<void> {
    return from(StatusBar.setStyle(options));
  }
}
