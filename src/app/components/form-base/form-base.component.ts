import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ltm-form-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class FormBaseComponent {
  public readonly form!: FormGroup;
}
