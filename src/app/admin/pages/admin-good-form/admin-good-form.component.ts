import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoodApiService } from '../../../core/api/good-api.service';
import {
  GoodAvailability,
  GoodPayload,
  GOOD_AVAILABILITY_VALUES,
} from '../../../core/models/good.model';
import { buildGoodImagesFromFields } from '../../../shared/utils/good-images.util';
import { ImagePickerComponent } from '../../../shared/components/image-picker/image-picker.component';
import { ToastService } from '../../../shared/services/toast.service';
import { switchMap, of, catchError } from 'rxjs';
import { ApiError } from '../../../core/api/api-client.service';

@Component({
  selector: 'app-admin-good-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImagePickerComponent],
  templateUrl: './admin-good-form.component.html',
  styleUrl: './admin-good-form.component.scss',
})
export class AdminGoodFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly goodApi = inject(GoodApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  goodForm!: FormGroup;
  isEditMode = false;
  goodId: number | null = null;
  submitted = false;

  loading = signal(false);
  loadError = signal<string | null>(null);
  submitError = signal<string | null>(null);

  readonly categories = ['Engraved', 'Handcrafted', 'Custom', 'Gift'];
  readonly availabilities = GOOD_AVAILABILITY_VALUES;

  ngOnInit(): void {
    this.goodForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Engraved', Validators.required],
      price: [null as number | null, Validators.required],
      availability: ['Available' as GoodAvailability, Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      material: ['', Validators.required],
      finish: [''],
      dimensions: [''],
      personalization: [''],
      image1: ['', Validators.required],
      image2: [''],
      image3: [''],
      image4: [''],
      notes: [''],
      featured: [false],
      active: [true],
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id && this.route.snapshot.url.some((s) => s.path === 'edit')) {
            this.isEditMode = true;
            this.goodId = +id;
            this.loading.set(true);
            return this.goodApi.getAdminGoodById(+id).pipe(
              catchError(() => {
                this.loadError.set('Could not load good. Please try again.');
                return of(undefined);
              }),
            );
          }
          return of(undefined);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((good) => {
        this.loading.set(false);

        if (good) {
          const sorted = [...(good.images ?? [])].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
          );
          const [img1, img2, img3, img4] = sorted.map((i) => i.imageUrl);
          this.goodForm.patchValue({
            name: good.name,
            category: good.category,
            price: good.price != null ? +good.price : null,
            availability: good.availability,
            shortDescription: good.shortDescription,
            description: good.description,
            material: good.material,
            finish: good.finish ?? '',
            dimensions: good.dimensions ?? '',
            personalization: good.personalization ?? '',
            image1: img1 ?? '',
            image2: img2 ?? '',
            image3: img3 ?? '',
            image4: img4 ?? '',
            notes: good.notes ?? '',
            featured: good.featured,
            active: good.active,
          });
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError.set(null);
    if (this.goodForm.invalid) return;
    const value = this.goodForm.value;
    const images = buildGoodImagesFromFields(
      value.image1,
      value.image2,
      value.image3,
      value.image4,
      value.name,
    );

    if (images.length === 0) {
      return;
    }

    const payload: GoodPayload = {
      name: value.name,
      category: value.category,
      price: value.price ?? null,
      availability: value.availability,
      shortDescription: value.shortDescription,
      description: value.description,
      material: value.material,
      finish: value.finish || undefined,
      dimensions: value.dimensions || undefined,
      personalization: value.personalization || undefined,
      notes: value.notes || undefined,
      featured: value.featured,
      active: value.active,
      images,
    };

    const request$ =
      this.isEditMode && this.goodId
        ? this.goodApi.updateGood(this.goodId, payload)
        : this.goodApi.createGood(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success(
          this.isEditMode ? 'Good updated successfully.' : 'Good added successfully.',
        );
        this.router.navigate(['/admin/goods']);
      },
      error: (err) => {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Could not save good. Please try again.';
        this.submitError.set(message);
      },
    });
  }

  isInvalid(field: string): boolean {
    const control = this.goodForm.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }
}
