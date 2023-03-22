import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'logout',
  standalone: true,
  imports: [
    CommonModule,
    WaitDialogComponent,
    TranslateModule
  ],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.auth.logOut().subscribe({
      complete: () => { this.router.navigate(['/']) }
    });
  }
}
