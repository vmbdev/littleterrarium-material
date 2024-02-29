import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { LocationService } from '@services/location.service';
import { Light } from '@models/location.model';

type LightOptionType = {
  value: string;
  asset: string;
};

@Component({
  selector: 'ltm-location-form-light',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatIconModule,
    TranslocoModule,
    FormBaseActionComponent,
  ],
  templateUrl: './location-form-light.component.html',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationFormLightComponent {
  private readonly locationService = inject(LocationService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly $lightOptions = signal<LightOptionType[]>(
    this.createLightOptions(),
  );

  /**
   * Refresh the selection in the template; otherwise description won't
   * show.
   */
  updLight = effect(() => {
    if (this.$lightOptions()) this.cdr.markForCheck();
  })

  createLightOptions(): LightOptionType[] {
    return Object.keys(Light).map((key) => ({
      value: key,
      asset: this.locationService.getLightAsset(key),
    }));
  }
}
