import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'ltm-inline-control',
  standalone: true,
  imports: [MatFormFieldModule],
  templateUrl: './inline-control.component.html',
  styleUrl: './inline-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineControlComponent {
  name = input.required<string>();
}
