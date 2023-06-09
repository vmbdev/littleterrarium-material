import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'plant-form-name',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './plant-form-name.component.html',
  styleUrls: ['./plant-form-name.component.scss']
})
export class PlantFormNameComponent {
  @Input() currentCustomName: string | null = '';
  public form = this.fb.group({ customName: [''] });

  constructor (private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ customName: this.currentCustomName })
  }
}
