import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

// TODO: adapt location, plant and photos to use this
@Component({
  selector: 'form-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.scss']
})
export abstract class FormBaseComponent {
  public form!: FormGroup;
}
