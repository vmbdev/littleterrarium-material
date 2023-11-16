import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ProfileComponent } from '@components/user/profile/profile.component';
import {
  LocationListComponent
} from '@components/location/location-list/location-list.component';
import {
  PlantListComponent
} from '@components/plant/plant-list/plant-list.component';
import { ApiService } from '@services/api.service';
import { User } from '@models/user.model';

@Component({
  selector: 'ltm-terrarium',
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    LocationListComponent,
    PlantListComponent
  ],
  templateUrl: './terrarium.component.html'
})
export class TerrariumComponent {
  user$?: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');

    if (username) {
      this.user$ = this.api.getUserByName(username);
    }

  }

}
