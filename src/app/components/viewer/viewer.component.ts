import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Signal,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ViewerData } from '@models/viewer.model';
import { VIEWER_DATA } from 'src/tokens';

type Coords = {
  x: number;
  y: number;
};

type ElementDimensions = {
  width: number;
  height: number;
};

@Component({
  selector: 'ltm-viewer',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent {
  protected readonly data: ViewerData = inject(VIEWER_DATA);

  viewer = viewChild.required<ElementRef>('viewer');
  canvas = viewChild.required<ElementRef>('canvas');

  private $ctx: Signal<CanvasRenderingContext2D> = computed(() =>
    this.canvas().nativeElement.getContext('2d'),
  );
  private image = new Image();
  private position: Coords = { x: 0, y: 0 };
  private previousDelta: Coords = { x: 0, y: 0 };
  private $scale = signal<number>(1);
  private baseScale: number = 0;
  private $imageDimensions: Signal<ElementDimensions> = computed(() => {
    return {
      width: this.image.naturalWidth * this.$scale(),
      height: this.image.naturalHeight * this.$scale(),
    };
  });

  private $vWidth = computed(() => this.viewer().nativeElement.clientWidth);
  private $vHeight = computed(() => this.viewer().nativeElement.clientHeight);

  ngOnInit() {
    this.image.src = this.data.src;
    this.image.onload = () => {
      this.resize();
      this.baseScale = this.$scale();
    };
  }

  /**
   * Returns the scale so that the image fully fits the screen
   */
  resetScale() {
    const scaleX = this.$vWidth() / this.image.naturalWidth;
    const scaleY = this.$vHeight() / this.image.naturalHeight;
    this.$scale.set(Math.min(scaleX, scaleY));
  }

  /**
   * Clear the canvas to redraw on it
   */
  clear() {
    this.$ctx().clearRect(0, 0, this.$vWidth(), this.$vHeight());
  }

  /**
   * Calculate the positions for the initial drawing
   */
  init() {
    const imgdms = this.$imageDimensions();

    this.position.x = (this.$vWidth() - imgdms.width) / 2;
    this.position.y = (this.$vHeight() - imgdms.height) / 2;
  }

  /**
   * Draw the image on canvas
   */
  draw() {
    const imgdms = this.$imageDimensions();

    this.clear();
    this.$ctx().drawImage(
      this.image,
      this.position.x,
      this.position.y,
      imgdms.width,
      imgdms.height,
    );
  }

  @HostListener('window:resize')
  resize() {
    this.$vWidth = computed(() => this.viewer().nativeElement.clientWidth);
    this.$vHeight = computed(() => this.viewer().nativeElement.clientHeight);

    this.canvas().nativeElement.width = this.$vWidth();
    this.canvas().nativeElement.height = this.$vHeight();

    this.resetScale();
    this.init();
    this.draw();
  }

  /**
   * Move the image on the canvas
   * @param x In pixels, the horizontal distance
   * @param y In pixels, the vertial distance
   */
  move(x: number = 0, y: number = 0) {
    this.position.x += x;
    this.position.y += y;

    this.draw();
  }

  /**
   * Change the scale of the image when double tapped
   */
  doubleTap() {
    if (this.$scale() < 3) {
      this.$scale.update((val) => val * 2);
    } else this.resetScale();

    this.init();
    this.draw();
  }

  /**
   * Move the image when receives a pan event
   * @param event
   */
  panMove(event: any) {
    const deltaxDiff = this.previousDelta.x - event.deltaX;
    const deltayDiff = this.previousDelta.y - event.deltaY;
    const imgdms = this.$imageDimensions();

    if (deltaxDiff !== 0 && this.$imageDimensions().width > this.$vWidth()) {
      const destX = this.position.x - deltaxDiff;
      this.previousDelta.x = event.deltaX;

      // test the horizontal limits to not move the photo out of screen
      if (destX <= 0 && imgdms.width + destX >= this.$vWidth()) {
        this.move(-deltaxDiff, 0);
      }
    }

    // test the vertical limits to not move the photo out of screen
    if (deltayDiff !== 0 && this.$imageDimensions().height > this.$vHeight()) {
      const destY = this.position.y - deltayDiff;
      this.previousDelta.y = event.deltaY;

      if (destY <= 0 && imgdms.height + destY >= this.$vHeight()) {
        this.move(0, -deltayDiff);
      }
    }
  }

  panEnd() {
    this.previousDelta.x = 0;
    this.previousDelta.y = 0;
  }

  pinchMove(event: any) {
    let delta: number;

    if (event.scale > 0 && event.scale < 3) {
      delta = (event.scale - 1) * 0.5;

      this.$scale.update((val) => {
        const res = val + (delta * 0.5);
        let ret;

        if (res < this.baseScale) {
          this.init();
          ret = this.baseScale;
        } else if (res < 3) ret = res;
        else ret = val;

        return ret;
      });
      this.draw();
    }
  }
}
