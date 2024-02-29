import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface WaitDialogConfig {
  message: string;
  progressBar?: boolean;
  progressValue?: number;
  finalMessage?: string;
}

// FIXME: replace with background spinner
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
  public readonly data: WaitDialogConfig = inject(MAT_DIALOG_DATA);
}
