import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'property',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent {
  @Input() icon: string = 'info';
  @Input() iconColor?: string;
  @ViewChild('propertyTemplate') propertyTemplate!: TemplateRef<any>;
}
