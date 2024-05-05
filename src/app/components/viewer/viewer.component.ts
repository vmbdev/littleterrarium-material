import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Signal,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, finalize } from 'rxjs';
import interact from 'interactjs';

import { ViewerData } from '@models/viewer.model';
import { FullscreenService } from '@services/fullscreen/fullscreen.service';
import { VIEWER_DATA } from 'src/tokens';

type Coords = {
  x: number;
  y: number;
};

@Component({
  selector: 'ltm-viewer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent {
  protected readonly data: ViewerData = inject(VIEWER_DATA);
  private readonly fullscreen = inject(FullscreenService);
  private readonly destroyRef = inject(DestroyRef);

  viewer = viewChild.required<ElementRef>('viewer');
  canvas = viewChild.required<ElementRef>('canvas');

  private image = new Image();
  private position: Coords = { x: 0, y: 0 };
  private minZoom = 0.125;
  private maxZoom = 2.5;

  private $scale = signal(1);
  private $imageDim: Signal<Coords> = computed(() => {
    return {
      x: this.image.naturalWidth * this.$scale(),
      y: this.image.naturalHeight * this.$scale(),
    };
  });
  private $vWidth = computed(() => this.viewer().nativeElement.clientWidth);
  private $vHeight = computed(() => this.viewer().nativeElement.clientHeight);

  private $ctx: Signal<CanvasRenderingContext2D> = computed(() =>
    this.canvas().nativeElement.getContext('2d'),
  );

  protected closeViewer$?: Observable<any>;

  ngOnDestroy() {
    this.close();
  }

  ngAfterViewInit(): void {
    this.fullscreen
      .start()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.image.src = this.data.src;
    this.image.crossOrigin = 'anonymous';

    this.image.onload = () => {
      this.position.x = (this.$vWidth() - this.$imageDim().x) / 2;
      this.position.y = (this.$vHeight() - this.$imageDim().y) / 2;
      this.resize();
      this.setupCanvasInteraction();
    };
  }

  @HostListener('window:resize')
  resize() {
    this.$vWidth = computed(() => this.viewer().nativeElement.clientWidth);
    this.$vHeight = computed(() => this.viewer().nativeElement.clientHeight);

    this.canvas().nativeElement.width = this.$vWidth();
    this.canvas().nativeElement.height = this.$vHeight();

    this.init();
  }

  setupCanvasInteraction() {
    interact(this.$ctx().canvas)
      .draggable({
        onmove: (event) => {
          this.dragImage(event.dx, event.dy);
        },
      })
      .gesturable({
        onmove: (event) => {
          this.zoom(event.ds, event.clientX, event.clientY, true);
        },
      })
      .on('mousewheel', (event) => {
        this.zoom(event.deltaY, event.clientX, event.clientY);

        event.preventDefault();
      })
      .on('doubletap', (event) => {
        this.zoom(-400, event.clientX, event.clientY);

        event.preventDefault();
      });
  }

  zoom(
    delta: number,
    pointerX: number,
    pointerY: number,
    scale: boolean = false,
  ) {
    let newScale: number;
    const factor = scale ? 1 : -0.001;
    const ratio = this.$scale() + delta * factor;

    if (ratio < this.$scale() && ratio < this.minZoom * 1.1) {
      this.init();
    } else {
      newScale = Math.min(
        Math.max(this.minZoom, this.$scale() + delta * factor),
        this.maxZoom,
      );
      const newImageDimX = newScale * this.image.naturalWidth;
      const newImageDimY = newScale * this.image.naturalHeight;

      if (newImageDimX >= this.$vWidth() || newImageDimY >= this.$vHeight()) {
        const newX =
          pointerX - (pointerX - this.position.x) * (newScale / this.$scale());
        const newY =
          pointerY - (pointerY - this.position.y) * (newScale / this.$scale());

        this.$scale.set(newScale);
        this.move(newX, newY, true);
      }
    }
  }

  /**
   * Draw the image on canvas
   */
  draw() {
    this.clear();
    this.$ctx().drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.$imageDim().x,
      this.$imageDim().y,
    );
  }

  /**
   * Clear the canvas to redraw on it
   */
  clear() {
    this.$ctx().clearRect(0, 0, this.$vWidth(), this.$vHeight());
  }

  /**
   * Move the image on the canvas
   * @param x In pixels, the horizontal distance
   * @param y In pixels, the vertical distance
   */
  move(x: number = 0, y: number = 0, full: boolean = false) {
    const borderX = this.$ctx().canvas.width - this.$imageDim().x;
    const borderY = this.$ctx().canvas.height - this.$imageDim().y;
    const newX = full ? x : this.position.x + x;
    const newY = full ? y : this.position.y + y;

    // test the horizontal limits to not move the photo out of screen
    if (newX <= 0 && newX >= borderX) this.position.x = newX;
    else if (newX < borderX) {
      this.position.x = Math.min(0, this.$vWidth() - this.$imageDim().x);
    }

    // test the vertical limits to not move the photo out of screen
    if (newY <= 0 && newY >= borderY) this.position.y = newY;
    else if (newY < borderY) {
      this.position.y = Math.min(0, this.$vHeight() - this.$imageDim().y);
    }

    this.draw();
  }

  dragImage(dx: number, dy: number) {
    const canvasW = this.$ctx().canvas.width;
    const canvasH = this.$ctx().canvas.height;

    // if image is wider than the canvas
    if (dx !== 0 && this.$imageDim().x > canvasW) this.move(dx, 0);

    // if image is taller than the canvas
    if (dy !== 0 && this.$imageDim().y > canvasH) this.move(0, dy);
  }

  close() {
    this.closeViewer$ = this.fullscreen.stop().pipe(
      finalize(() => {
        this.data.close();
      }),
    );
  }

  /**
   * Returns the scale so that the image fully fits the screen
   */
  resetScale() {
    const scaleX = this.$vWidth() / this.image.naturalWidth;
    const scaleY = this.$vHeight() / this.image.naturalHeight;
    this.minZoom = Math.min(scaleX, scaleY);
    this.$scale.set(this.minZoom);
  }

  /**
   * Calculate the positions for the initial drawing
   */
  init() {
    this.resetScale();

    const imgdms = this.$imageDim();

    this.position.x = (this.$vWidth() - imgdms.x) / 2;
    this.position.y = (this.$vHeight() - imgdms.y) / 2;

    this.draw();
  }
}
