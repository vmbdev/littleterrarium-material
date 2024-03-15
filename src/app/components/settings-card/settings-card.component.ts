import { Component, TemplateRef, input, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

@Component({
  selector: 'ltm-settings-card',
  standalone: true,
  imports: [
    MatCardModule,
    LimitLargeScreenDirective,
  ],
  templateUrl: './settings-card.component.html',
  styleUrl: './settings-card.component.scss'
})
export class SettingsCardComponent {
  title = input.required<string>();
  template = viewChild.required<TemplateRef<any>>('template');
}
