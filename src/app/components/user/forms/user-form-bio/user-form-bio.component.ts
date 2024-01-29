import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'ltm-user-form-bio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
  ],
  templateUrl: './user-form-bio.component.html',
})
export class UserFormBioComponent implements FormBaseComponent {
  @Input() currentBio?: string | null;
  public readonly form = this.fb.group({ bio: [''] });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentBio) {
      this.form.patchValue({ bio: this.currentBio });
    }
  }
}
