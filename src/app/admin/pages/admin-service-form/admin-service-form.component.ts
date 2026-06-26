import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceApiService } from '../../../core/api/service-api.service';
import {
  ServicePayload,
  SERVICE_ENQUIRY_TYPE_OPTIONS,
  ServiceEnquiryType,
} from '../../../core/models/service.model';
import { switchMap, of, catchError } from 'rxjs';
import { ImagePickerComponent } from '../../../shared/components/image-picker/image-picker.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-service-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImagePickerComponent],
  templateUrl: './admin-service-form.component.html',
  styleUrl: './admin-service-form.component.scss',
})
export class AdminServiceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly serviceApi = inject(ServiceApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  serviceForm!: FormGroup;
  isEditMode = false;
  serviceId: number | null = null;
  submitted = false;

  loadError = signal<string | null>(null);
  submitError = signal<string | null>(null);

  readonly enquiryTypes = SERVICE_ENQUIRY_TYPE_OPTIONS;

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      enquiryType: ['Custom Knife' as ServiceEnquiryType, Validators.required],
      imageUrl: ['', Validators.required],
      active: [true],
      featured: [false],
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id && this.route.snapshot.url.some((s) => s.path === 'edit')) {
            this.isEditMode = true;
            this.serviceId = +id;
            return this.serviceApi.getAdminServiceById(+id).pipe(
              catchError(() => {
                this.loadError.set('Could not load service. Please try again.');
                return of(undefined);
              }),
            );
          }
          return of(undefined);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((service) => {
        if (service) {
          this.serviceForm.patchValue({
            title: service.title,
            shortDescription: service.shortDescription,
            description: service.description,
            enquiryType: service.enquiryType,
            imageUrl: service.imageUrl,
            active: service.active,
            featured: service.featured,
          });
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError.set(null);
    if (this.serviceForm.invalid) return;
    const value = this.serviceForm.value;
    const payload: ServicePayload = {
      title: value.title,
      shortDescription: value.shortDescription,
      description: value.description,
      enquiryType: value.enquiryType,
      imageUrl: value.imageUrl,
      active: value.active,
      featured: value.featured,
    };

    const request$ =
      this.isEditMode && this.serviceId
        ? this.serviceApi.updateService(this.serviceId, payload)
        : this.serviceApi.createService(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success(
          this.isEditMode ? 'Service updated successfully.' : 'Service added successfully.',
        );
        this.router.navigate(['/admin/services']);
      },
      error: () => {
        this.submitError.set('Could not save service. Please try again.');
      },
    });
  }

  isInvalid(field: string): boolean {
    const control = this.serviceForm.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }
}
