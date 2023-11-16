import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface WaitDialogConfig {
  message: string,
  progressBar?: boolean,
  progressValue?: number,
  finalMessage?: string,
}

@Component({
  selector: 'ltm-wait-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  templateUrl: './wait-dialog.component.html',
  styleUrls: ['./wait-dialog.component.scss']
})
export class WaitDialogComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: WaitDialogConfig) {}

}
