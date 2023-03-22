import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface MainToolbarButton {
  icon: string,
  route?: any,
  click?: any
}

@Injectable({
  providedIn: 'root'
})
export class MainToolbarService {
  name$ = new BehaviorSubject<string>('');
  buttons$ = new BehaviorSubject<MainToolbarButton[]>([]);

  constructor() { }

  setName(name: string) {
    this.name$.next(name);
  }

  setButtons(buttons: MainToolbarButton[]) {
    this.buttons$.next(buttons);
  }
}
