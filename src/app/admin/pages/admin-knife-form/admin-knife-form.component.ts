import { Component, OnInit, inject, signal } from '@angular/core';
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
import { ToastService } from '../../../shared/services/toast.service';
import { switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-admin-knife-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImagePickerComponent],
  templateUrl: './admin-knife-form.component.html',
  styleUrl: './admin-knife-form.component.scss',
})
export class AdminKnifeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly knifeApi = inject(KnifeApiService);
  private readonly toast = inject(ToastService);

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
      category: ['Hunting', Validators.required],
      price: [null as number | null, Validators.required],
      availability: ['Available' as KnifeAvailability, Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      steelType: ['', Validators.required],
      handleMaterial: ['', Validators.required],
      bladeLength: ['', Validators.required],
      overallLength: ['', Validators.required],
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

    if (images.length === 0) {
      return;
    }
    const payload: KnifePayload = {
      name: value.name,
      category: value.category,
      price: value.price ?? null,
      availability: value.availability,
      shortDescription: value.shortDescription,
      description: value.description,
      steelType: value.steelType,
      handleMaterial: value.handleMaterial,
      bladeLength: value.bladeLength,
      overallLength: value.overallLength,
      notes: value.notes || undefined,
      featured: value.featured,
      active: value.active,
      images,
    };
    const request$ =
      this.isEditMode && this.knifeId
        ? this.knifeApi.updateKnife(this.knifeId, payload)
        : this.knifeApi.createKnife(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(
          this.isEditMode ? 'Knife updated successfully.' : 'Knife added successfully.',
        );
        this.router.navigate(['/admin/knives']);
      },
      error: () => {
        this.submitError.set('Could not save knife. Please try again.');
      },
    });
  }

  isInvalid(field: string): boolean {
    const control = this.knifeForm.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }
}
