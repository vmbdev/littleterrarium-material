import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'fab',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent {
  @Input() link?: string;
  @Input() text: string = '+';
}
