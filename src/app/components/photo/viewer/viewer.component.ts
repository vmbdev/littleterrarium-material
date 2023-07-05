import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type ElementDimensions = {
  width: number,
  height: number
}

@Component({
  selector: 'viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent {
  @ViewChild('photo', { read: ElementRef, static: true }) photoElement!: ElementRef<HTMLImageElement>;
  @Input({ required: true }) imageSrc?: string;
  @Output() close = new EventEmitter();
  scale: number = 1;
  position = {
    left: 0,
    top: 0,
  }
  previousDelta = {
    x: 0,
    y: 0
  }
  dimensions: ElementDimensions = {
    width: 0,
    height: 0
  }
  client: ElementDimensions = {
    width: 0,
    height: 0
  }
  rightLimit: number = 0;
  bottomLimit: number = 0;

  ngOnInit(): void {
    this.client.width = window.innerWidth;
    this.client.height = window.innerHeight;
  }
  
  imageLoaded() {
    this.dimensions.width = this.photoElement.nativeElement.width;
    this.dimensions.height = this.photoElement.nativeElement.height;

    this.setLimits();
  }

  setLimits(): void {
    const currDimensions = this.getCurrentDimensions();
    const limitx = (currDimensions.width / this.client.width);
    const limity = (currDimensions.height / this.client.height);

    this.rightLimit = Math.ceil(this.client.width * (limitx - 1));
    this.bottomLimit = Math.ceil(this.client.height * (limity - 1));
  }

  setScale(val: number) {
    this.scale = val;
    this.photoElement.nativeElement.style.width = val * this.dimensions.width + 'px';
    this.photoElement.nativeElement.style.height = val * this.dimensions.height + 'px';
    this.setLimits();
  }

  getCurrentDimensions(): ElementDimensions {
    const dimensions: ElementDimensions = {
      width: this.scale * this.dimensions.width,
      height: this.scale * this.dimensions.height
    }

    return dimensions;
  }

  updatePosition(): void {
      const rect = this.photoElement.nativeElement.getBoundingClientRect()
      this.position.left = Math.ceil(+rect.left);
      this.position.top = Math.ceil(+rect.top);
    }

  resetPosition(): void {
    this.photoElement.nativeElement.style.top = 'auto';
    this.photoElement.nativeElement.style.left = 'auto';
    this.position.left = 0;
    this.position.top = 0;
  }

  doubleTap(event: any) {
    if (this.scale > 3) {
      this.setScale(1);
      this.resetPosition();
    }
    else {
      this.setScale(this.scale * 2);
      this.updatePosition();
    }
  }

  // FIXME: not any
  panMove(event: any) {
    if (this.scale > 1) {
      const target = event.target as HTMLElement;
      const deltaxDiff = this.previousDelta.x - event.deltaX;
      const deltayDiff = this.previousDelta.y - event.deltaY;

      if (deltaxDiff !== 0) {
        const left = this.position.left - (deltaxDiff);
        this.previousDelta.x = event.deltaX;
    
        if ((left <= 0) && (left >= -this.rightLimit)) {
          this.position.left = left;
          target.style.left = `${this.position.left}px`;
        }
      }

      if (deltayDiff !== 0) {
        const top = this.position.top - (deltayDiff);
        this.previousDelta.y = event.deltaY;
  
        if ((top <= 0) && (top >= -this.bottomLimit)) {
          this.position.top = top;
          target.style.top = `${this.position.top}px`;
        }
      }
    }
  }

  panEnd(event: any) {
    this.previousDelta.x = 0;
    this.previousDelta.y = 0;
  }

  pinchEnd(event: any) {
    // this.setScale(1);
  }

  pinchMove(event: any) {
    // console.log('move', event.scale);

    // if (event.scale > 1) {
    //   this.setScale(Math.ceil(event.scale));
    // }
  }

  closeEvent() {
    this.close.emit();
  }
}
