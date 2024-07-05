import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, skipWhile, tap } from 'rxjs';

import { FullWidthDirective } from '@directives/full-width/full-width.directive';

@Component({
  selector: 'ltm-user-form-username',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
    FullWidthDirective,
  ],
  templateUrl: './user-form-username.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormUsernameComponent {
  private readonly rootFormGroup = inject(FormGroupDirective);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  protected $form?: WritableSignal<FormGroup>;
  protected readonly $errorTaken = signal<boolean>(false);
  protected readonly $errorInvalid = signal<boolean>(false);

  ngOnInit() {
    this.$form = signal(this.rootFormGroup.control);
    this.rootFormGroup.control.statusChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(),
      skipWhile((status) => status === 'VALID'),
      tap(() => {
        if (this.checkForError('invalid')) this.$errorInvalid.set(true);
        else if (this.checkForError('taken')) this.$errorTaken.set(true);
        this.cdr.markForCheck();
      }),
    )
    .subscribe();
  }

  checkForError(error: string): boolean {
    if (this.rootFormGroup.control) {
      const errors = this.rootFormGroup.control.get('username')?.errors;
      return errors && errors[error];
    }

    return false;
  }
}
