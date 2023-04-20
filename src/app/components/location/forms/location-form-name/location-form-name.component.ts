import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@models/location.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'location-form-name',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './location-form-name.component.html',
  styleUrls: ['./location-form-name.component.scss']
})
export class LocationFormNameComponent {
  @Input() location?: Location;
  public form = this.fb.group({ name: ['', Validators.required] });

  constructor (private fb: FormBuilder) {}

}
