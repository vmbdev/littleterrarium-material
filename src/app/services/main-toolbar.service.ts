import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface MainToolbarButton {
  icon: string,
  tooltip: string,
  route?: any,
  click?: any
}

@Injectable({
  providedIn: 'root'
})
export class MainToolbarService {
  name$ = new BehaviorSubject<string>('');
  buttons$ = new BehaviorSubject<MainToolbarButton[]>([]);
  menu$ = new BehaviorSubject<MainToolbarButton[]>([]);
  hidden$ = new BehaviorSubject<boolean>(true);

  setName(name: string) {
    this.hidden$.next(false);
    this.name$.next(name);
  }

  setButtons(buttons: MainToolbarButton[]) {
    this.hidden$.next(false);
    this.buttons$.next(buttons);
  }

  setMenu(menu: MainToolbarButton[]) {
    this.hidden$.next(false);
    this.menu$.next(menu);
  }

  hide() {
    this.buttons$.next([]);
    this.menu$.next([]);
    this.name$.next('');
    this.hidden$.next(true);
  }

  show() {
    this.hidden$.next(false);
  }
}
