import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface MainToolbarButton {
  icon: string;
  tooltip?: string;
  route?: any;
  click?: any;
  selected?: BehaviorSubject<boolean>;
}

type MainToolbarButtonCollection = MainToolbarButton[];

@Injectable({
  providedIn: 'root',
})
export class MainToolbarService {
  private readonly name = new BehaviorSubject<string>('');
  public readonly name$ = this.name.asObservable();
  private readonly buttons = new BehaviorSubject<MainToolbarButton[]>([]);
  public readonly buttons$ = this.buttons.asObservable();
  private readonly menu = new BehaviorSubject<MainToolbarButtonCollection[]>(
    [],
  );
  public readonly menu$ = this.menu.asObservable();
  private readonly hidden = new BehaviorSubject<boolean>(true);
  public readonly hidden$ = this.hidden.asObservable();

  setName(name: string) {
    this.hidden.next(false);
    this.name.next(name);
  }

  setButtons(buttons: MainToolbarButton[]) {
    this.hidden.next(false);
    this.buttons.next(buttons);
  }

  addButtons(buttons: MainToolbarButton[]) {
    const curr = this.buttons.getValue();

    this.setButtons([...curr, ...buttons]);
  }

  setMenu(menu: MainToolbarButtonCollection[]) {
    this.hidden.next(false);
    this.menu.next(menu);
  }

  addButtonsToMenu(menu: MainToolbarButtonCollection[]) {
    const curr = this.menu.getValue();

    this.setMenu([...curr, ...menu]);
  }

  hide() {
    this.buttons.next([]);
    this.menu.next([]);
    this.name.next('');
    this.hidden.next(true);
  }

  show() {
    this.hidden.next(false);
  }
}
