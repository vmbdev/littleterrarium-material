import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  numberAttribute,
  Signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ltm-image-generator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGeneratorComponent {
  canvas = viewChild.required<ElementRef>('canvas');
  name = input.required<string>();
  width = input(200, { transform: numberAttribute });
  height = input(200, { transform: numberAttribute });
  rounded = input(false, { transform: booleanAttribute });
  responsive = input(false, { transform: booleanAttribute });

  private readonly colors = [
    '#292f36',
    '#4ecdc4',
    '#ffdac6',
    '#ff6b6b',
    '#ffe66d',
  ];
  private $ctx: Signal<CanvasRenderingContext2D> = computed(() =>
    this.canvas().nativeElement.getContext('2d'),
  );

  draw = effect(() => {
    const char = this.name().slice(0,1).toUpperCase();

    this.$ctx().canvas.height = this.height();
    this.$ctx().canvas.width = this.width();

    this.$ctx().fillStyle = this.generateColorByName();
    this.$ctx().fillRect(0, 0, this.width(), this.height())
    
    this.$ctx().save();
    this.$ctx().translate(this.width() / 2, this.height() / 2);
    this.$ctx().rotate(-Math.PI/4);
    this.$ctx().textAlign = 'center';
    this.$ctx().textBaseline = 'middle';
    this.$ctx().fillStyle = '#ffffff';
    this.$ctx().strokeStyle = '#000000';
    this.$ctx().lineWidth = 3;
    this.$ctx().font = `${this.width() / 15}rem sans-serif`;
    this.$ctx().strokeText(char, 0, this.height() / 3.75);
    this.$ctx().fillText(char, 0, this.height() / 3.75);
    this.$ctx().restore();
  })

  generateColorByName(): string {
    const dep = this.name().slice(-1);
    let hash: number;

    if (dep >= 'a' && dep < 'e') hash = 0;
    else if (dep >= 'e' && dep < 'j') hash = 1;
    else if (dep >= 'j' && dep < 'o') hash = 2;
    else if (dep >= 'o' && dep < 't') hash = 3;
    else hash = 4;

    return this.colors[hash];
  }
}
