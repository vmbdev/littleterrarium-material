import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Observable } from 'rxjs';

import { ApiService } from '@services/api.service';
import { ImagePathService } from '@services/image-path.service';
import { Location } from '@models/location.model';
import { ImagePath } from '@models/image-path.model';
import { FabComponent } from '@components/fab/fab.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'location-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    TranslateModule,
    FabComponent
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

  getHeaderPic(images: ImagePath): string | null {
    return this.imagePath.get(images, 'thumb');
  }
}
