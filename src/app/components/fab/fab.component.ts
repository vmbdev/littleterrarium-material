import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ltm-fab',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
})
export class FabComponent {
  @Input({ required: true }) link?: string | any[];
  @Input() text: string = '+';
}
