import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Plant } from '@models/plant.model';
import { PlantService } from '@services/plant.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'plant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent {
  @Input() list?: Plant[];

  constructor(
    private plantService: PlantService,
  ) {}

  ngOnInit(): void { }

  getName(plant: Plant): string {
    return this.plantService.getVisibleName(plant);
  }

  getImgUrl(plant: Plant): string {
    return this.plantService.coverPhoto(plant);
  }
}
