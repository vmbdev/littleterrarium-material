import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'plant-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './plant-toolbar.component.html',
  styleUrls: ['./plant-toolbar.component.scss']
})
export class PlantToolbarComponent {
  @Output() water = new EventEmitter();
  @Output() fertilise = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();

  constructor() {}
}
