import { CommonModule } from '@angular/common';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { FormGroupDirective, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ltm-form-base-action',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-base-action.component.html',
  styleUrl: './form-base-action.component.scss'
})
export class FormBaseActionComponent {
  private readonly rootFormGroup = inject(FormGroupDirective);
  protected $form?: WritableSignal<FormGroup>;

  ngOnInit() {
    this.$form = signal(this.rootFormGroup.control);
  }
}
