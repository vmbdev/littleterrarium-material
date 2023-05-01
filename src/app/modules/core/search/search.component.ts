import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SearchService } from '@services/search.service';

@Component({
  selector: 'search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  constructor(
    private search: SearchService
  ) {}

  keyPress(value: string): void {
    if (value.length > 0) this.search.setText(value);
    else this.search.clear();
  }

  clear(input: HTMLInputElement): void {
    input.value = '';
    this.search.clear();
  }
}
