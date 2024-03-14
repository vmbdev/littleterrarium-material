import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { FullWidthDirective } from '@directives/full-width/full-width.directive';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'ltm-photo-form-description',
  standalone: true,
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormBaseActionComponent,
    FullWidthDirective,
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  templateUrl: './photo-form-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormDescriptionComponent {}
