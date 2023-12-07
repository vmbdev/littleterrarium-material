import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

// TODO: adapt location, plant and photos to use this
@Component({
  selector: 'ltm-form-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-base.component.html',
})
export abstract class FormBaseComponent {
  public form!: FormGroup;
}
