import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { EnquiryApiService } from '../../../core/api/enquiry-api.service';
import { KnifeApiService } from '../../../core/api/knife-api.service';
import { ServiceApiService } from '../../../core/api/service-api.service';
import {
  EnquiryType,
  ENQUIRY_TYPE_VALUES,
  ENQUIRY_MESSAGE_PLACEHOLDERS,
  KNIFE_ENQUIRY_MESSAGE_PLACEHOLDER,
  EnquiryPayload,
} from '../../../core/models/enquiry.model';

import { Knife } from '../../../core/models/knife.model';
import { Service } from '../../../core/models/service.model';

export type EnquiryMode = 'general' | 'knife' | 'service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly enquiryApi = inject(EnquiryApiService);
  private readonly knifeApi = inject(KnifeApiService);
  private readonly serviceApi = inject(ServiceApiService);

  enquiryForm!: FormGroup;
  submitted = false;
  showSuccess = false;

  submitting = signal(false);
  submitError = signal<string | null>(null);

  readonly mode = signal<EnquiryMode>('general');
  readonly preselectedKnife = signal<Knife | null>(null);
  readonly preselectedService = signal<Service | null>(null);
  readonly selectedEnquiryType = signal<EnquiryType>('General');

  readonly generalEnquiryOptions = ENQUIRY_TYPE_VALUES;

  readonly pageTitle = computed(() => {
    if (this.mode() === 'knife' && this.preselectedKnife()) {
      return 'Enquire About This Knife';
    }
    if (this.mode() === 'service' && this.preselectedService()) {
      return `Enquire — ${this.preselectedService()!.title}`;
    }
    return 'Send an Enquiry';
  });

  readonly messagePlaceholder = computed(() => {
    if (this.mode() === 'knife') {
      return KNIFE_ENQUIRY_MESSAGE_PLACEHOLDER;
    }
    return ENQUIRY_MESSAGE_PLACEHOLDERS[this.selectedEnquiryType()];
  });

  readonly fixedEnquiryTypeLabel = computed(() => this.getContextEnquiryType() ?? '');

  private routeSub?: Subscription;
  private typeSub?: Subscription;

  ngOnInit(): void {
    this.buildForm('general');
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const knifeId = params.get('knifeId');
      const serviceId = params.get('serviceId');
      const enquiryType = params.get('enquiryType') as EnquiryType | null;

      if (knifeId) {
        this.knifeApi
          .getKnives()
          .pipe(map((knives) => knives.find((k) => k.id === +knifeId) ?? null))
          .subscribe((knife) => {
            if (knife) {
              this.mode.set('knife');
              this.preselectedKnife.set(knife);
              this.preselectedService.set(null);
              this.buildForm('knife');
            } else {
              this.setGeneralMode(enquiryType);
            }
          });

        return;
      }

      if (serviceId) {
        this.serviceApi
          .getServices()
          .pipe(map((services) => services.find((s) => s.id === +serviceId) ?? null))
          .subscribe((service) => {
            if (service) {
              this.mode.set('service');
              this.preselectedService.set(service);
              this.preselectedKnife.set(null);
              this.buildForm('service', service.enquiryType);
            } else {
              this.setGeneralMode(enquiryType);
            }
          });

        return;
      }
      this.setGeneralMode(enquiryType);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.typeSub?.unsubscribe();
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError.set(null);
    if (this.enquiryForm.invalid) return;
    const raw = this.enquiryForm.getRawValue();
    const mode = this.mode();
    const knife = this.preselectedKnife();
    const service = this.preselectedService();
    const payload: EnquiryPayload = {
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      enquiryType:
        mode === 'knife'
          ? 'Knife Enquiry'
          : mode === 'service'
            ? service!.enquiryType
            : raw.enquiryType,

      message: raw.message,
    };

    if (mode === 'knife' && knife) {
      payload.selectedKnifeId = knife.id;
      payload.selectedKnifeName = knife.name;
    }

    if (mode === 'service' && service) {
      payload.selectedServiceId = service.id;
      payload.selectedServiceName = service.title;
    }
    this.submitting.set(true);
    this.enquiryApi.createEnquiry(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.showSuccess = true;
        this.submitted = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Could not send your enquiry. Please try again.');
      },
    });
  }

  isInvalid(field: string): boolean {
    const control = this.enquiryForm.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  sendAnother(): void {
    this.showSuccess = false;
    this.submitError.set(null);
    const mode = this.mode();

    if (mode === 'general') {
      this.enquiryForm.reset({ enquiryType: 'General' });
      this.selectedEnquiryType.set('General');
    } else {
      this.enquiryForm.reset();

      if (mode === 'knife') {
        this.enquiryForm.get('enquiryType')?.setValue('Knife Enquiry');
      } else if (this.preselectedService()) {
        this.enquiryForm.get('enquiryType')?.setValue(this.preselectedService()!.enquiryType);
      }
    }
  }

  private setGeneralMode(enquiryType: EnquiryType | null): void {
    this.mode.set('general');
    this.preselectedKnife.set(null);
    this.preselectedService.set(null);
    const type = enquiryType && ENQUIRY_TYPE_VALUES.includes(enquiryType) ? enquiryType : 'General';

    this.buildForm('general', type);
  }

  private buildForm(mode: EnquiryMode, enquiryType: EnquiryType = 'General'): void {
    this.typeSub?.unsubscribe();

    if (mode === 'knife') {
      this.selectedEnquiryType.set('Knife Enquiry');
      this.enquiryForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        enquiryType: [{ value: 'Knife Enquiry', disabled: true }, Validators.required],
        message: ['', [Validators.required, Validators.minLength(10)]],
      });
      return;
    }

    if (mode === 'service') {
      this.selectedEnquiryType.set(enquiryType);
      this.enquiryForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        enquiryType: [{ value: enquiryType, disabled: true }, Validators.required],
        message: ['', [Validators.required, Validators.minLength(10)]],
      });
      return;
    }
    this.selectedEnquiryType.set(enquiryType);
    this.enquiryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      enquiryType: [enquiryType, Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
    this.typeSub = this.enquiryForm
      .get('enquiryType')!
      .valueChanges.subscribe((type: EnquiryType) => {
        this.selectedEnquiryType.set(type);
      });
  }

  private getContextEnquiryType(): EnquiryType | null {
    if (this.mode() === 'knife') return 'Knife Enquiry';
    if (this.mode() === 'service') return this.preselectedService()?.enquiryType ?? null;

    return null;
  }
}
