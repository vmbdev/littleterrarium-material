import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LangSwitcherButtonComponent } from '@components/lang-switcher-button/lang-switcher-button.component';

@Component({
  selector: 'ltm-unsigned-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    LangSwitcherButtonComponent,
  ],
  templateUrl: './unsigned-toolbar.component.html',
  styleUrl: './unsigned-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsignedToolbarComponent {
  private readonly location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
