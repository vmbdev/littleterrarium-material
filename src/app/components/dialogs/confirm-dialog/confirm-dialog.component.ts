import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

interface ConfirmDataConfig {
  title: string,
  question: string[],
  accept: any
}

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDataConfig) {}
}
