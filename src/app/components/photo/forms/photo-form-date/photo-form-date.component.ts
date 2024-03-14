import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroupDirective,
  ControlContainer,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { FullWidthDirective } from '@directives/full-width/full-width.directive';

@Component({
  selector: 'ltm-photo-form-date',
  standalone: true,
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormBaseActionComponent,
    FullWidthDirective,
  ],
  templateUrl: './photo-form-date.component.html',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormDateComponent {
  protected today = new Date();
}
