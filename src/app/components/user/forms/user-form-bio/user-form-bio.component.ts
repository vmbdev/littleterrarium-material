import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'user-form-bio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './user-form-bio.component.html',
  styleUrls: ['./user-form-bio.component.scss']
})
export class UserFormBioComponent implements FormBaseComponent {
  @Input() currentBio: string | null = '';
  public form = this.fb.group({ bio: [''] });

  constructor (private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ bio: this.currentBio })
  }
}
