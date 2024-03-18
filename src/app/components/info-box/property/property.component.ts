import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ltm-property',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyComponent {
  icon = input<string>('info');
  iconColor = input<string | null>();
  propertyTemplate = viewChild.required<TemplateRef<any>>('propertyTemplate');
}
