import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  numberAttribute,
  output,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import interact from 'interactjs';

type Coords = {
  x: number;
  y: number;
};

@Component({
  selector: 'ltm-image-crop',
  standalone: true,
  imports: [],
  templateUrl: './image-crop.component.html',
  styleUrl: './image-crop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropComponent {
  canvas = viewChild.required<ElementRef>('canvas');
  size = input(300, { transform: numberAttribute });
  minZoom = input(0.125, { transform: numberAttribute });
  maxZoom = input(2.5, { transform: numberAttribute });
  imageSource = input.required<File>();
  imageFile = output<File>();

  private $ctx: Signal<CanvasRenderingContext2D> = computed(() =>
    this.canvas().nativeElement.getContext('2d'),
  );
  private image = new Image();
  private $scale = signal(1);
  private position: Coords = { x: 0, y: 0 };
  private $imageDim: Signal<Coords> = computed(() => {
    return {
      x: this.image.naturalWidth * this.$scale(),
      y: this.image.naturalHeight * this.$scale(),
    };
  });

  ngAfterViewInit(): void {
    this.image.src = URL.createObjectURL(this.imageSource());
    // this.image.src = 'http://localhost:5015/public/fb/7d/82/1df6fc837408ef96ca822ec8839149d23a.webp';
    // this.image.src = 'https://littleterrarium.one/public/b9/12/53/ee637c8d07c8317c2373411ea767cb9498.webp';
    // this.image.src = 'http://localhost:5015/public/ava.jpg';
    this.image.crossOrigin = 'anonymous';
    this.$ctx().canvas.width = this.size();
    this.$ctx().canvas.height = this.size();

    this.image.onload = () => {
      if (
        this.image.naturalWidth >= this.size() &&
        this.image.naturalHeight >= this.size()
      ) {
        this.$scale.set(1);
      } else {
        const mindim = Math.min(
          this.image.naturalHeight,
          this.image.naturalWidth,
        );
        const ratio = this.size() / mindim;

        this.$scale.set(ratio);
      }

      this.position.x = (this.size() - this.$imageDim().x) / 2;
      this.position.y = (this.size() - this.$imageDim().y) / 2;
      this.draw();
      this.setupCanvasInteraction();
      this.snapshot();
      URL.revokeObjectURL(this.image.src);
    };
  }

  setupCanvasInteraction() {
    interact(this.$ctx().canvas)
      .draggable({
        onmove: (event) => {
          this.dragImage(event.dx, event.dy);
        },
        onend: () => {
          this.snapshot();
        },
      })
      .gesturable({
        onmove: (event) => {
          this.zoom(event.ds, event.clientX, event.clientY, true);
        },
        onend: () => {
          this.snapshot();
        },
      })
      .on('mousewheel', (event) => {
        this.zoom(event.deltaY, event.clientX, event.clientY);

        event.stopPropagation();
        event.preventDefault();
      })
      .on('doubletap', (event) => {
        this.zoom(-400, event.clientX, event.clientY);
        this.snapshot();

        event.preventDefault();
      });
  }

  zoom(
    delta: number,
    pointerX: number,
    pointerY: number,
    scale: boolean = false,
  ) {
    const factor = scale ? 1 : -0.001;
    const newScale = Math.min(
      Math.max(this.minZoom(), this.$scale() + delta * factor),
      this.maxZoom(),
    );

    const newImageDimX = newScale * this.image.naturalWidth;
    const newImageDimY = newScale * this.image.naturalHeight;

    if (newImageDimX >= this.size() && newImageDimY >= this.size()) {
      const newX =
        pointerX - (pointerX - this.position.x) * (newScale / this.$scale());
      const newY =
        pointerY - (pointerY - this.position.y) * (newScale / this.$scale());

      this.$scale.set(newScale);
      this.move(newX, newY, true);
    }
  }

  /**
   * Draw the image on canvas
   */
  draw(grid: boolean = true) {
    this.clear();
    this.$ctx().drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.$imageDim().x,
      this.$imageDim().y,
    );

    if (grid) this.drawGrid();
  }

  drawGrid() {
    const gap = this.size() / 4;
    this.$ctx().beginPath();
    this.$ctx().lineWidth = 0.5;
    this.$ctx().strokeStyle = 'grey';

    for (let i = 1; i <= 3; i++) {
      this.$ctx().moveTo(i * gap, 0);
      this.$ctx().lineTo(i * gap, this.size());
      this.$ctx().stroke();

      this.$ctx().moveTo(0, i * gap);
      this.$ctx().lineTo(this.size(), i * gap);
      this.$ctx().stroke();
    }
  }

  /**
   * Clear the canvas to redraw on it
   */
  clear() {
    this.$ctx().clearRect(0, 0, this.size(), this.size());
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
      this.position.x = Math.min(0, this.size() - this.$imageDim().x);
    }

    // test the vertical limits to not move the photo out of screen
    if (newY <= 0 && newY >= borderY) this.position.y = newY;
    else if (newY < borderY) {
      this.position.y = Math.min(0, this.size() - this.$imageDim().y);
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

  snapshot() {
    this.draw(false);

    this.$ctx().canvas.toBlob(
      (blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], `snap-${Date.now()}.jpeg`, {
            type: 'image/jpeg',
          });

          this.imageFile.emit(file);
        }
      },
      'image/jpeg',
      80,
    );

    this.draw();
  }
}
