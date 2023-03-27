import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'toggle-option',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatRippleModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss']
})
export class ToggleOptionComponent {
  @Input() defaultChecked: boolean = false;
  @Output() change = new EventEmitter<boolean>();
  sliderChecked: boolean = false;

  ngOnInit(): void {
    this.sliderChecked = this.defaultChecked;
  }

  toggleOption(): void {
    this.sliderChecked = !this.sliderChecked;
    this.change.emit(this.sliderChecked);
  }
}
