import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';

import { SearchService } from '@services/search/search.service';

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
    TranslocoModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly search = inject(SearchService);

  searchElement = viewChild.required<ElementRef>('searchInput');

  readonly focusSearchbar = effect(() => {
    this.searchElement().nativeElement.focus();
  })

  keyPress(value: string): void {
    if (value.length > 0) this.search.setText(value);
    else this.search.clear();
  }

  clear(input: HTMLInputElement): void {
    input.value = '';
    this.search.clear();
  }
}
