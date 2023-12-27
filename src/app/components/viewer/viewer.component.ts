import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { VIEWER_DATA } from 'src/tokens';

type ViewerData = {
  src: string;
  close: Function;
};

type ElementDimensions = {
  width: number;
  height: number;
};

type CSSElementPosition = {
  left: number | null;
  top: number | null;
};

@Component({
  selector: 'ltm-viewer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent {
  @ViewChild('photo', { read: ElementRef, static: true })
  photoElement!: ElementRef<HTMLImageElement>;

  scale: number = 1;
  position: CSSElementPosition = {
    left: null,
    top: null,
  };
  previousDelta = {
    x: 0,
    y: 0,
  };
  dimensions: ElementDimensions = {
    width: 0,
    height: 0,
  };
  client: ElementDimensions = {
    width: 0,
    height: 0,
  };
  rightLimit: number = 0;
  bottomLimit: number = 0;

  constructor(@Inject(VIEWER_DATA) public readonly data: ViewerData) {}

  ngOnInit(): void {
    this.client.width = window.innerWidth;
    this.client.height = window.innerHeight;
  }

  imageLoaded() {
    this.dimensions.width = this.photoElement.nativeElement.width;
    this.dimensions.height = this.photoElement.nativeElement.height;

    this.findLimits();
  }

  /**
   * Get the current size of the image in pixels by multiplying the original
   * dimensions by its scale.
   * @returns
   */
  getCurrentDimensions(): ElementDimensions {
    const dimensions: ElementDimensions = {
      width: this.scale * this.dimensions.width,
      height: this.scale * this.dimensions.height,
    };

    return dimensions;
  }

  /**
   * Calculate the limits where we can move the image without leaving
   * empty spaces around.
   */
  findLimits(): void {
    const currDimensions = this.getCurrentDimensions();
    const limitx = currDimensions.width / this.client.width;
    const limity = currDimensions.height / this.client.height;

    this.rightLimit = Math.ceil(this.client.width * (limitx - 1));
    this.bottomLimit = Math.ceil(this.client.height * (limity - 1));
  }

  /**
   * Change the size of the rendered image
   * @param val - A number specifying the new scale
   */
  setScale(val: number) {
    this.scale = val;
    this.photoElement.nativeElement.style.transition = '0.1s';
    this.photoElement.nativeElement.style.width =
      val * this.dimensions.width + 'px';
    this.photoElement.nativeElement.style.height =
      val * this.dimensions.height + 'px';
    this.findLimits();

    setTimeout(() => {
      this.updatePosition();
      this.photoElement.nativeElement.style.transition = 'none';
    }, 100);
  }

  /**
   *
   * @param val
   * @param multiply
   */
  magnify(val: number, multiply: boolean = false) {
    if (this.position.left) {
      this.position.left = val * this.position.left;
      this.photoElement.nativeElement.style.left = this.position.left + 'px';
    }
    // if (this.position.top) {
    //   this.position.top = val * this.position.top;
    //   this.photoElement.nativeElement.style.top = this.position.top + 'px';
    // }

    this.setScale(multiply ? this.scale * val : val);
  }

  /**
   * Find out the coordinates (left and top) of the image after resizing it
   */
  updatePosition(): void {
    const rect = this.photoElement.nativeElement.getBoundingClientRect();
    this.position.left = Math.ceil(+rect.left);
    this.position.top = Math.ceil(+rect.top);
  }

  resetView(): void {
    this.setScale(1);

    this.photoElement.nativeElement.style.top = 'auto';
    this.photoElement.nativeElement.style.left = 'auto';
    this.position.left = null;
    this.position.top = null;
  }

  doubleTap(event: any) {
    if (this.scale > 3) {
      this.resetView();
    } else {
      this.magnify(2, true);
    }
  }

  // FIXME: not any
  panMove(event: any) {
    if (this.scale > 1) {
      const target = event.target as HTMLElement;
      const deltaxDiff = this.previousDelta.x - event.deltaX;
      const deltayDiff = this.previousDelta.y - event.deltaY;

      if (deltaxDiff !== 0) {
        const left = (this.position.left ? this.position.left : 0) - deltaxDiff;
        this.previousDelta.x = event.deltaX;

        if (left <= 0 && left >= -this.rightLimit) {
          this.position.left = left;
          target.style.left = `${left}px`;
        }
      }

      if (deltayDiff !== 0) {
        const top = (this.position.top ? this.position.top : 0) - deltayDiff;
        this.previousDelta.y = event.deltaY;

        if (top <= 0 && top >= -this.bottomLimit) {
          this.position.top = top;
          target.style.top = `${top}px`;
        }
      }
    }
  }

  panEnd(event: any) {
    this.previousDelta.x = 0;
    this.previousDelta.y = 0;
  }

  pinchEnd(event: any) {
    if (this.position.left && this.position.left <= -this.dimensions.width) {
      this.position.left = -this.rightLimit;
      this.photoElement.nativeElement.style.left = this.position.left + 'px';
    }
  }

  pinchMove(event: any) {
    if (event.scale > 1 && event.scale < 5) {
      this.magnify(event.scale);
      this.updatePosition();
    } else if (event.scale <= 1) this.resetView();
  }
}
