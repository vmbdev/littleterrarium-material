import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ltm-form-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-base.component.html',
})
export abstract class FormBaseComponent {
  public form!: FormGroup;
}
