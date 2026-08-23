import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, of, Subscription, switchMap } from 'rxjs';
import { EnquiryApiService } from '../../../core/api/enquiry-api.service';
import { KnifeApiService } from '../../../core/api/knife-api.service';
import { GoodApiService } from '../../../core/api/good-api.service';
import { ServiceApiService } from '../../../core/api/service-api.service';
import {
  EnquiryType,
  ENQUIRY_TYPE_VALUES,
  ENQUIRY_MESSAGE_PLACEHOLDERS,
  KNIFE_ENQUIRY_MESSAGE_PLACEHOLDER,
  GOOD_ENQUIRY_MESSAGE_PLACEHOLDER,
  EnquiryPayload,
} from '../../../core/models/enquiry.model';
import { Knife } from '../../../core/models/knife.model';
import { Good } from '../../../core/models/good.model';
import { Service } from '../../../core/models/service.model';
import { SeoService } from '../../../core/services/seo.service';

export type EnquiryMode = 'general' | 'knife' | 'good' | 'service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly enquiryApi = inject(EnquiryApiService);
  private readonly knifeApi = inject(KnifeApiService);
  private readonly goodApi = inject(GoodApiService);
  private readonly serviceApi = inject(ServiceApiService);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  enquiryForm!: FormGroup;
  submitted = false;
  showSuccess = false;

  submitting = signal(false);
  submitError = signal<string | null>(null);

  readonly mode = signal<EnquiryMode>('general');
  readonly preselectedKnife = signal<Knife | null>(null);
  readonly preselectedGood = signal<Good | null>(null);
  readonly preselectedService = signal<Service | null>(null);
  readonly selectedEnquiryType = signal<EnquiryType>('General');

  readonly generalEnquiryOptions = ENQUIRY_TYPE_VALUES;

  readonly pageTitle = computed(() => {
    if (this.mode() === 'knife' && this.preselectedKnife()) {
      return 'Enquire About This Knife';
    }
    if (this.mode() === 'good' && this.preselectedGood()) {
      return 'Enquire About This Item';
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
    if (this.mode() === 'good') {
      return GOOD_ENQUIRY_MESSAGE_PLACEHOLDER;
    }
    return ENQUIRY_MESSAGE_PLACEHOLDERS[this.selectedEnquiryType()];
  });

  readonly fixedEnquiryTypeLabel = computed(() => this.getContextEnquiryType() ?? '');

  private typeSub?: Subscription;

  ngOnInit(): void {
    this.seo.update({
      title: 'Contact Knowles Knives | Randburg & Johannesburg Enquiries',
      description:
        'Contact Knowles Knives for custom knife enquiries in Randburg and Johannesburg. By appointment — no online payments.',
      path: '/contact',
    });

    this.buildForm('general');

    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          const knifeId = params.get('knifeId');
          const goodId = params.get('goodId');
          const serviceId = params.get('serviceId');
          const enquiryType = params.get('enquiryType') as EnquiryType | null;

          if (knifeId) {
            return this.knifeApi.getKnives().pipe(
              map((knives) => ({
                kind: 'knife' as const,
                knife: knives.find((k) => k.id === +knifeId) ?? null,
                enquiryType,
              })),
            );
          }

          if (goodId) {
            return this.goodApi.getGoods().pipe(
              map((goods) => ({
                kind: 'good' as const,
                good: goods.find((g) => g.id === +goodId) ?? null,
                enquiryType,
              })),
            );
          }

          if (serviceId) {
            return this.serviceApi.getServices().pipe(
              map((services) => ({
                kind: 'service' as const,
                service: services.find((s) => s.id === +serviceId) ?? null,
                enquiryType,
              })),
            );
          }

          return of({ kind: 'general' as const, enquiryType });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (result.kind === 'knife') {
          if (result.knife) {
            this.mode.set('knife');
            this.preselectedKnife.set(result.knife);
            this.preselectedGood.set(null);
            this.preselectedService.set(null);
            this.buildForm('knife');
          } else {
            this.setGeneralMode(result.enquiryType);
          }
          return;
        }

        if (result.kind === 'good') {
          if (result.good) {
            this.mode.set('good');
            this.preselectedGood.set(result.good);
            this.preselectedKnife.set(null);
            this.preselectedService.set(null);
            this.buildForm('good');
          } else {
            this.setGeneralMode(result.enquiryType);
          }
          return;
        }

        if (result.kind === 'service') {
          if (result.service) {
            this.mode.set('service');
            this.preselectedService.set(result.service);
            this.preselectedKnife.set(null);
            this.preselectedGood.set(null);
            this.buildForm('service', result.service.enquiryType);
          } else {
            this.setGeneralMode(result.enquiryType);
          }
          return;
        }

        this.setGeneralMode(result.enquiryType);
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError.set(null);
    if (this.enquiryForm.invalid) return;
    const raw = this.enquiryForm.getRawValue();
    const mode = this.mode();
    const knife = this.preselectedKnife();
    const good = this.preselectedGood();
    const service = this.preselectedService();
    const payload: EnquiryPayload = {
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      enquiryType:
        mode === 'knife'
          ? 'Knife Enquiry'
          : mode === 'good'
            ? 'Goods Enquiry'
            : mode === 'service'
              ? service!.enquiryType
              : raw.enquiryType,
      message: raw.message,
    };

    if (mode === 'knife' && knife) {
      payload.selectedKnifeId = knife.id;
      payload.selectedKnifeName = knife.name;
    }

    if (mode === 'good' && good) {
      payload.selectedGoodId = good.id;
      payload.selectedGoodName = good.name;
    }

    if (mode === 'service' && service) {
      payload.selectedServiceId = service.id;
      payload.selectedServiceName = service.title;
    }

    this.submitting.set(true);
    this.enquiryApi
      .createEnquiry(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.showSuccess = true;
          this.submitted = false;
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
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
      } else if (mode === 'good') {
        this.enquiryForm.get('enquiryType')?.setValue('Goods Enquiry');
      } else if (this.preselectedService()) {
        this.enquiryForm.get('enquiryType')?.setValue(this.preselectedService()!.enquiryType);
      }
    }
  }

  private setGeneralMode(enquiryType: EnquiryType | null): void {
    this.mode.set('general');
    this.preselectedKnife.set(null);
    this.preselectedGood.set(null);
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

    if (mode === 'good') {
      this.selectedEnquiryType.set('Goods Enquiry');
      this.enquiryForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        enquiryType: [{ value: 'Goods Enquiry', disabled: true }, Validators.required],
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
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type: EnquiryType) => {
        this.selectedEnquiryType.set(type);
      });
  }

  private getContextEnquiryType(): EnquiryType | null {
    if (this.mode() === 'knife') return 'Knife Enquiry';
    if (this.mode() === 'good') return 'Goods Enquiry';
    if (this.mode() === 'service') return this.preselectedService()?.enquiryType ?? null;
    return null;
  }
}
