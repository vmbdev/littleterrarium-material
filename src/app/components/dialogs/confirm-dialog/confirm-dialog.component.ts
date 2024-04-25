import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  protected readonly data: ConfirmDataConfig = inject(MAT_DIALOG_DATA);

  accept(): void {
    if (this.data.accept) {
      this.data.accept();
    }
  }
}
