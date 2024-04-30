import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';

import { InlineControlComponent } from '@components/inline-control/inline-control.component';
import { LanguageService } from '@services/language/language.service';

@Component({
  selector: 'ltm-lang-switcher',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    TranslocoModule,
    InlineControlComponent,
  ],
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {
  protected readonly language = inject(LanguageService);
}
