import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationListComponent } from '@components/location/location-list/location-list.component';
import { SigninComponent } from '@components/user/signin/signin.component';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    CommonModule,
    LocationListComponent,
    SigninComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public auth: AuthService) {}

}
