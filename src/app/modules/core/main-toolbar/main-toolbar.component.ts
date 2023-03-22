import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MainToolbarService } from '@services/main-toolbar.service';

@Component({
  selector: 'main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent {

  constructor(
    public mt: MainToolbarService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
}
