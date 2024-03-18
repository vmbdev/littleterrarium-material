import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { AuthService } from '@services/auth.service';
import { LocationService } from '@services/location.service';
import { PhotoService } from '@services/photo.service';
import { PlantService } from '@services/plant.service';
import { TaskService } from '@services/task.service';

@Component({
  selector: 'ltm-logout',
  standalone: true,
  imports: [
    CommonModule,
    WaitDialogComponent,
    TranslocoModule,
    MatDialogModule,
  ],
  templateUrl: './logout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  private readonly taskService = inject(TaskService);
  private readonly plantService = inject(PlantService);
  private readonly photoService = inject(PhotoService);
  private readonly locationService = inject(LocationService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslocoService);

  ngOnInit(): void {
    const wd = this.openWaitDialog();

    // For security, remove personal data stored in those services when out
    this.auth
      .logOut()
      .pipe(
        finalize(() => {
          wd.close();
        }),
      )
      .subscribe(() => {
        this.taskService.empty();
        this.plantService.empty();
        this.photoService.empty();
        this.locationService.empty();
        this.router.navigate(['/']);
      });
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.translate('user-logout.msg'),
        progressBar: false,
      },
    });
  }
}
