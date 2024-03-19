import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

interface MainToolbarButton {
  icon: string;
  tooltip?: string;
  route?: any;
  click?: any;
  $selected?: Signal<boolean>;
}

type MainToolbarButtonCollection = MainToolbarButton[];

@Injectable({
  providedIn: 'root',
})
export class MainToolbarService {
  readonly #$name: WritableSignal<string> = signal('');
  public readonly $name = this.#$name.asReadonly();

  readonly #$buttons: WritableSignal<MainToolbarButton[]> = signal([]);
  public readonly $buttons = this.#$buttons.asReadonly();

  readonly #$menu: WritableSignal<MainToolbarButtonCollection[]> = signal([]);
  public readonly $menu = this.#$menu.asReadonly();

  readonly #$hidden: WritableSignal<boolean> = signal(true);
  public readonly $hidden = this.#$hidden.asReadonly();

  setName(name: string) {
    this.#$hidden.set(false);
    this.#$name.set(name);
  }

  setButtons(buttons: MainToolbarButton[]) {
    this.#$hidden.set(false);
    this.#$buttons.set(buttons);
  }

  addButtons(buttons: MainToolbarButton[]) {
    this.#$hidden.set(false);
    this.#$buttons.update((val) => [...val, ...buttons]);
  }

  setMenu(menu: MainToolbarButtonCollection[]) {
    this.#$hidden.set(false);
    this.#$menu.set(menu);
  }

  addButtonsToMenu(menu: MainToolbarButtonCollection[]) {
    this.#$hidden.set(false);
    this.#$menu.update((val) => [...val, ...menu]);
  }

  hide() {
    this.#$buttons.set([]);
    this.#$menu.set([]);
    this.#$name.set('');
    this.#$hidden.set(true);
  }

  show() {
    this.#$hidden.set(false);
  }
}
