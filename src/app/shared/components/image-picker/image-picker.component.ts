import { Component, Input, OnDestroy, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadApiService } from '../../../core/api/upload-api.service';
import { firstValueFrom } from 'rxjs';

const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 900;

@Component({
  selector: 'app-image-picker',
  standalone: true,
  templateUrl: './image-picker.component.html',
  styleUrl: './image-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagePickerComponent),
      multi: true,
    },
  ],
})
export class ImagePickerComponent implements ControlValueAccessor, OnDestroy {
  private readonly uploadApi = inject(UploadApiService);

  @Input() label = 'Image';
  @Input() required = false;

  value = '';
  disabled = false;

  previewUrl = '';
  pendingFile: File | null = null;
  private objectUrl: string | null = null;

  positionX = signal(50);
  positionY = signal(50);
  isPanning = signal(false);
  framingDirty = signal(false);
  uploading = signal(false);
  error = signal<string | null>(null);

  private panStart = { x: 0, y: 0, posX: 50, posY: 50 };
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    if (!this.pendingFile) {
      this.previewUrl = this.value;
      this.positionX.set(50);
      this.positionY.set(50);
      this.framingDirty.set(false);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get objectPosition(): string {
    return `${this.positionX()}% ${this.positionY()}%`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || this.disabled) {
      return;
    }

    this.error.set(null);
    this.pendingFile = file;
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.previewUrl = this.objectUrl;
    this.positionX.set(50);
    this.positionY.set(50);
    this.framingDirty.set(true);
    this.value = '';
    this.onChange('');
  }

  onPanStart(event: PointerEvent): void {
    if (this.disabled || !this.previewUrl || this.uploading()) {
      return;
    }

    event.preventDefault();
    this.isPanning.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.panStart = {
      x: event.clientX,
      y: event.clientY,
      posX: this.positionX(),
      posY: this.positionY(),
    };
  }

  onPanMove(event: PointerEvent): void {
    if (!this.isPanning()) {
      return;
    }

    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const deltaX = event.clientX - this.panStart.x;
    const deltaY = event.clientY - this.panStart.y;
    const nextX = this.clamp(this.panStart.posX - (deltaX / rect.width) * 100, 0, 100);
    const nextY = this.clamp(this.panStart.posY - (deltaY / rect.height) * 100, 0, 100);

    this.positionX.set(nextX);
    this.positionY.set(nextY);
    this.framingDirty.set(true);
  }

  onPanEnd(event: PointerEvent): void {
    if (!this.isPanning()) {
      return;
    }

    this.isPanning.set(false);
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  resetPosition(): void {
    this.positionX.set(50);
    this.positionY.set(50);
    if (this.previewUrl) {
      this.framingDirty.set(true);
    }
  }

  saveFraming(): void {
    if (this.disabled || this.uploading() || !this.previewUrl) {
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    this.renderCroppedFile()
      .then((file) => firstValueFrom(this.uploadApi.uploadImage(file)))
      .then((url) => {
        this.value = url;
        this.previewUrl = url;
        this.pendingFile = null;
        this.revokeObjectUrl();
        this.framingDirty.set(false);
        this.onChange(url);
        this.onTouched();
        this.uploading.set(false);
      })
      .catch((err: Error) => {
        this.error.set(err.message ?? 'Could not save image. Please try again.');
        this.uploading.set(false);
      });
  }

  clear(): void {
    if (this.disabled) {
      return;
    }

    this.value = '';
    this.previewUrl = '';
    this.pendingFile = null;
    this.revokeObjectUrl();
    this.positionX.set(50);
    this.positionY.set(50);
    this.framingDirty.set(false);
    this.error.set(null);
    this.onChange('');
    this.onTouched();
  }

  private async renderCroppedFile(): Promise<File> {
    const image = await this.loadImage(this.previewUrl);
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not prepare image for upload.');
    }

    const posX = this.positionX();
    const posY = this.positionY();
    const iw = image.naturalWidth;
    const ih = image.naturalHeight;
    const cw = OUTPUT_WIDTH;
    const ch = OUTPUT_HEIGHT;
    const scale = Math.max(cw / iw, ch / ih);
    const renderWidth = iw * scale;
    const renderHeight = ih * scale;
    const x = (cw - renderWidth) * (posX / 100);
    const y = (ch - renderHeight) * (posY / 100);

    ctx.drawImage(image, x, y, renderWidth, renderHeight);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Could not process image.'));
          }
        },
        'image/jpeg',
        0.85,
      );
    });

    const baseName = this.pendingFile?.name.replace(/\.[^.]+$/, '') ?? 'image';
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () =>
        reject(
          new Error(
            'Could not load image for cropping. Try choosing the image again from your device.',
          ),
        );
      image.src = url;
    });
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
