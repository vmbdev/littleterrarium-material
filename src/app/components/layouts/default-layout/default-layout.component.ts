import { Component } from '@angular/core';
import { NavigationComponent } from '@components/navigation/navigation/navigation.component';

@Component({
  selector: 'ltm-default-layout',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {

}
