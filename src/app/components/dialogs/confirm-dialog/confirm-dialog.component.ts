import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';

interface ConfirmDataConfig {
  title: string;
  question: string[];
  accept: any;
}

@Component({
  selector: 'ltm-confirm-dialog',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmDataConfig
  ) {}

  accept(): void {
    if (this.data.accept) {
      this.data.accept();
    }
  }
}
