import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GalleryService } from '../../../core/services/gallery.service';
import {
  GalleryItem,
  GalleryCategory,
  GALLERY_CATEGORIES,
} from '../../../core/models/gallery-item.model';
import { switchMap, of, catchError } from 'rxjs';
import { ImagePickerComponent } from '../../../shared/components/image-picker/image-picker.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-gallery-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImagePickerComponent],
  templateUrl: './admin-gallery-form.component.html',
  styleUrl: './admin-gallery-form.component.scss',
})
export class AdminGalleryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly galleryService = inject(GalleryService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  form!: FormGroup;
  isEditMode = false;
  itemId: string | null = null;
  submitted = false;

  loadError = signal<string | null>(null);
  submitError = signal<string | null>(null);

  readonly categories = GALLERY_CATEGORIES;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      category: ['Knives' as GalleryCategory, Validators.required],
      active: [true],
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id && this.route.snapshot.url.some((s) => s.path === 'edit')) {
            this.isEditMode = true;
            this.itemId = id;
            return this.galleryService.getById(id).pipe(
              catchError(() => {
                this.loadError.set('Could not load gallery item. Please try again.');
                return of(undefined);
              }),
            );
          }
          return of(undefined);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((item) => {
        if (item) {
          this.form.patchValue({
            title: item.title,
            imageUrl: item.imageUrl,
            category: item.category,
            active: item.active,
          });
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError.set(null);
    if (this.form.invalid) return;
    const value = this.form.value;
    const itemData: Omit<GalleryItem, 'id'> = {
      title: value.title,
      imageUrl: value.imageUrl,
      category: value.category,
      active: value.active,
    };

    const request$ =
      this.isEditMode && this.itemId
        ? this.galleryService.updateItem(this.itemId, itemData)
        : this.galleryService.addItem(itemData);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success(
          this.isEditMode ? 'Gallery item updated successfully.' : 'Gallery item added successfully.',
        );
        this.router.navigate(['/admin/gallery']);
      },
      error: () => {
        this.submitError.set('Could not save gallery item. Please try again.');
      },
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }
}
