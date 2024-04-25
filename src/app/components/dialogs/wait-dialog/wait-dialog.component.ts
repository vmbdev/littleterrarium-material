import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface WaitDialogConfig {
  message: string;
  progressBar?: boolean;
  progressValue?: Signal<number>;
  finalMessage?: string;
}

@Component({
  selector: 'ltm-wait-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
  ],
  templateUrl: './wait-dialog.component.html',
  styleUrls: ['./wait-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitDialogComponent {
  protected readonly data: WaitDialogConfig = inject(MAT_DIALOG_DATA);
}
