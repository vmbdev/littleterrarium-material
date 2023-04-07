import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'plant-form-description',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './plant-form-description.component.html',
  styleUrls: ['./plant-form-description.component.scss']
})
export class PlantFormDescriptionComponent {
  @Input() currentDescription: string | null = '';
  form = this.fb.group({ description: [''] });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ description: this.currentDescription })
  }
}
