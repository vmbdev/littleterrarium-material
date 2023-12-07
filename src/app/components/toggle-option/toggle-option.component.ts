import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ltm-toggle-option',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatRippleModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
})
export class ToggleOptionComponent {
  @Input() checked: boolean = false;
  @Output() change = new EventEmitter<boolean>();
  currentlyChecked: boolean = false;

  ngOnInit(): void {
    this.currentlyChecked = this.checked;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checked'].currentValue !== changes['checked'].previousValue) {
      this.currentlyChecked = changes['checked'].currentValue;
    }
  }

  toggleOption(): void {
    this.currentlyChecked = !this.currentlyChecked;
    this.change.emit(this.currentlyChecked);
  }
}
