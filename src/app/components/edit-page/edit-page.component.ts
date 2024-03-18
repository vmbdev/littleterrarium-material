import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';

import { SettingsCardComponent } from '@components/settings-card/settings-card.component';

@Component({
  selector: 'ltm-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TranslocoModule,
  ],
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPageComponent {
  title = input.required<string>();
  accept = output();
  cards = contentChildren<SettingsCardComponent>(SettingsCardComponent);

  acceptChanges(): void {
    this.accept.emit();
  }
}
