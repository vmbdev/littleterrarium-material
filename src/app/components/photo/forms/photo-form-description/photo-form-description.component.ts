import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'ltm-photo-form-description',
  standalone: true,
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    FormBaseActionComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  templateUrl: './photo-form-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormDescriptionComponent {}
