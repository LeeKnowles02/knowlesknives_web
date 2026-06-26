import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GalleryService } from '../../../core/services/gallery.service';
import {
  GalleryItem,
  GalleryCategory,
  GALLERY_CATEGORIES,
} from '../../../core/models/gallery-item.model';
import { switchMap, of } from 'rxjs';
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

  form!: FormGroup;
  isEditMode = false;
  itemId: string | null = null;
  submitted = false;

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
            return this.galleryService.getById(id);
          }
          return of(undefined);
        }),
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
    if (this.form.invalid) return;
    const value = this.form.value;
    const itemData: Omit<GalleryItem, 'id'> = {
      title: value.title,
      imageUrl: value.imageUrl,
      category: value.category,
      active: value.active,
    };

    if (this.isEditMode && this.itemId) {
      this.galleryService.updateItem(this.itemId, itemData).subscribe({
        next: () => {
          this.toast.success('Gallery item updated successfully.');
          this.router.navigate(['/admin/gallery']);
        },
      });
    } else {
      this.galleryService.addItem(itemData).subscribe({
        next: () => {
          this.toast.success('Gallery item added successfully.');
          this.router.navigate(['/admin/gallery']);
        },
      });
    }
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }
}
