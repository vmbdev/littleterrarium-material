import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  LangDefinition,
  TranslocoModule,
  TranslocoService,
} from '@ngneat/transloco';
import { take } from 'rxjs';

@Component({
  selector: 'ltm-lang-switcher',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, TranslocoModule],
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {
  private readonly translate = inject(TranslocoService);

  protected readonly $current: WritableSignal<string> = signal(
    this.translate.getActiveLang(),
  );
  protected readonly languages =
    this.translate.getAvailableLangs() as LangDefinition[];

  setLang(lang: string) {
    this.translate
      .load(lang)
      .pipe(take(1))
      .subscribe(() => {
        this.$current.set(lang);
        this.translate.setActiveLang(lang);
      });
  }
}
