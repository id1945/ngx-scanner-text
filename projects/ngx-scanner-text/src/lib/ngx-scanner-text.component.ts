import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { createWorker } from 'tesseract.js';
const BLANK = '';

@Component({
  exportAs: 'scanner',
  selector: 'ngx-scanner-text',
  template: '<canvas #canvas [style.width.%]="100" [style.height.%]="100"></canvas>',
  queries: { canvas: new ViewChild('canvas', { static: true }) },
  inputs: ['src', 'languages', 'color'],
  outputs: ['result', 'worker'],
})
export class NgxScannerTextComponent implements OnInit {

  /* private */
  private canvas!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private result = new EventEmitter();
  private worker = new EventEmitter();

  /* public */
  public src: string = BLANK;
  public color: string = 'red';
  public languages: string[] = [];
  public data = {
    result: BLANK,
    worker: null
  }

  ngOnInit(): void {
    this.drawImage();
    this.doOCR(this.languages.join('+'));
  }

  public async drawImage(): Promise<void> {
    // Image full size
    const image: HTMLImageElement = await this.loadImage(this.src);
    this.canvas.nativeElement.width = image.naturalWidth;
    this.canvas.nativeElement.height = image.naturalHeight;
    // Context 2d
    this.ctx = this.canvas.nativeElement.getContext('2d');
    // DrawImage
    this.ctx.drawImage(image, 0, 0);
  }

  public async loadImage(src: string): Promise<HTMLImageElement> {
    const image = new Image();
    return new Promise(resolve => {
      image.src = src;
      image.onload = () => resolve(image)
    });
  }

  public async doOCR(language: string): Promise<void> {
    const worker = createWorker({
      logger: m => {
        this.worker.emit(m),
          this.data.worker = m
      }
    });
    await worker.load();
    await worker.loadLanguage(language);
    await worker.initialize(language);
    const { data: { text, words } } = await worker.recognize(this.src);
    this.result.emit(text);
    this.data.result = text;
    await worker.terminate();
    this.createOverlay(words);
  }

  public createOverlay(words: any): void {
    words.forEach((w: any) => {
      var b = w.bbox;
      this.ctx.strokeStyle = this.color;
      this.ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
    });
  }
}