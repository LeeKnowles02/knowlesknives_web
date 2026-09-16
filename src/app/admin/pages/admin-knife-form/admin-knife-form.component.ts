import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KnifeApiService } from '../../../core/api/knife-api.service';
import {
  KnifeAvailability,
  KnifePayload,
  KNIFE_AVAILABILITY_VALUES,
} from '../../../core/models/knife.model';
import { buildKnifeImagesFromFields } from '../../../shared/utils/knife-images.util';
import { ImagePickerComponent } from '../../../shared/components/image-picker/image-picker.component';
import { SwitchFieldComponent } from '../../../shared/components/switch-field/switch-field.component';
import { ToastService } from '../../../shared/services/toast.service';
import { switchMap, of, catchError } from 'rxjs';
import { ApiError } from '../../../core/api/api-client.service';

@Component({
  selector: 'app-admin-knife-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImagePickerComponent, SwitchFieldComponent],
  templateUrl: './admin-knife-form.component.html',
  styleUrl: './admin-knife-form.component.scss',
})
export class AdminKnifeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly knifeApi = inject(KnifeApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  knifeForm!: FormGroup;
  isEditMode = false;
  knifeId: number | null = null;
  submitted = false;

  loading = signal(false);
  loadError = signal<string | null>(null);
  submitError = signal<string | null>(null);

  readonly categories = ['Chef', 'Hunting', 'Utility', 'Collector', 'Custom', 'Kitchen'];
  readonly availabilities = KNIFE_AVAILABILITY_VALUES;

  ngOnInit(): void {
    this.knifeForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Hunting'],
      price: [null as number | null],
      availability: ['Available' as KnifeAvailability],
      shortDescription: [''],
      description: [''],
      steelType: [''],
      handleMaterial: [''],
      bladeLength: [''],
      overallLength: [''],
      image1: [''],
      image2: [''],
      image3: [''],
      image4: [''],
      notes: [''],
      featured: [false],
      active: [false],
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id && this.route.snapshot.url.some((s) => s.path === 'edit')) {
            this.isEditMode = true;
            this.knifeId = +id;
            this.loading.set(true);
            return this.knifeApi.getAdminKnifeById(+id).pipe(
              catchError(() => {
                this.loadError.set('Could not load knife. Please try again.');
                return of(undefined);
              }),
            );
          }
          return of(undefined);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((knife) => {
        this.loading.set(false);

        if (knife) {
          const sorted = [...(knife.images ?? [])].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
          );
          const [img1, img2, img3, img4] = sorted.map((i) => i.imageUrl);
          this.knifeForm.patchValue({
            name: knife.name,
            category: knife.category,
            price: knife.price != null ? +knife.price : null,
            availability: knife.availability,
            shortDescription: knife.shortDescription,
            description: knife.description,
            steelType: knife.steelType,
            handleMaterial: knife.handleMaterial,
            bladeLength: knife.bladeLength,
            overallLength: knife.overallLength,
            image1: img1 ?? '',
            image2: img2 ?? '',
            image3: img3 ?? '',
            image4: img4 ?? '',
            notes: knife.notes ?? '',
            featured: knife.featured,
            active: knife.active,
          });
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError.set(null);
    if (this.knifeForm.invalid) return;
    const value = this.knifeForm.value;
    const images = buildKnifeImagesFromFields(
      value.image1,
      value.image2,
      value.image3,
      value.image4,
      value.name,
    );

    const payload: KnifePayload = {
      name: value.name,
      category: value.category,
      price: value.price ?? null,
      availability: value.availability,
      shortDescription: value.shortDescription?.trim() || undefined,
      description: value.description?.trim() || undefined,
      steelType: value.steelType?.trim() || undefined,
      handleMaterial: value.handleMaterial?.trim() || undefined,
      bladeLength: value.bladeLength?.trim() || undefined,
      overallLength: value.overallLength?.trim() || undefined,
      notes: value.notes?.trim() || undefined,
      featured: value.featured,
      active: value.active,
      images,
    };

    const request$ =
      this.isEditMode && this.knifeId
        ? this.knifeApi.updateKnife(this.knifeId, payload)
        : this.knifeApi.createKnife(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success(
          this.isEditMode ? 'Knife updated successfully.' : 'Knife added successfully.',
        );
        this.router.navigate(['/admin/knives']);
      },
      error: (err) => {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Could not save knife. Please try again.';
        this.submitError.set(message);
      },
    });
  }

  isInvalid(field: string): boolean {
    const control = this.knifeForm.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }
}
