import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import {
  PropertyComponent
} from '@components/info-box/property/property.component';

@Component({
  selector: 'ltm-info-box',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent {
  @Input() description?: string | null = null;
  @ContentChildren(PropertyComponent) properties!: QueryList<PropertyComponent>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

}
