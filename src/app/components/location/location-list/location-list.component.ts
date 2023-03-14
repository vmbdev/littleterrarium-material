import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { ApiService } from '@services/api.service';
import { ImagePathService } from '@services/image-path.service';
import { Location } from '@models/location.model';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'location-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent {
  @Input() userId?: number;
  @Input() owned: boolean = true;
  locations$?: Observable<Location[]>;

  constructor(
    public apiService: ApiService,
    public imagePath: ImagePathService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const options = {
      plantCount: true,
      userId: this.userId ? this.userId : null
    }

    this.locations$ = this.apiService.getLocationList(options);
  }

  selectLocation(id: number) {
    this.router.navigate(['location', id]);
  }

  createLocation(): void {

  }
}
