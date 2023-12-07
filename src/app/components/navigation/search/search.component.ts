import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { SearchService } from '@services/search.service';

@Component({
  selector: 'ltm-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @ViewChild('searchInput') searchElement!: ElementRef<MatInput>;

  constructor(private search: SearchService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.searchElement.nativeElement.focus();
    this.cdr.detectChanges();
  }

  keyPress(value: string): void {
    if (value.length > 0) this.search.setText(value);
    else this.search.clear();
  }

  clear(input: HTMLInputElement): void {
    input.value = '';
    this.search.clear();
  }
}
