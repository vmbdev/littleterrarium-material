import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  effect,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import {
  PropertyComponent
} from '@components/info-box/property/property.component';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

@Component({
  selector: 'ltm-info-box',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    LimitLargeScreenDirective,
  ],
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBoxComponent {
  public readonly description = input<string | null>(null);
  protected readonly props = contentChildren<PropertyComponent>(PropertyComponent);

  private readonly updateProps = effect(() => {
    this.cdr.markForCheck();
  })

  private readonly cdr = inject(ChangeDetectorRef);
}
