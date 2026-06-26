export type EnquiryType =
  | 'General'
  | 'Knife Enquiry'
  | 'Custom Knife'
  | 'Knife Making Course'
  | 'Engraving'
  | 'Repairs / Sharpening'
  | 'Other';

export type EnquiryStatus = 'New' | 'Contacted' | 'Closed';

export const ENQUIRY_TYPE_VALUES: EnquiryType[] = [
  'General',
  'Knife Enquiry',
  'Custom Knife',
  'Knife Making Course',
  'Engraving',
  'Repairs / Sharpening',
  'Other',
];

export const ENQUIRY_STATUS_VALUES: EnquiryStatus[] = ['New', 'Contacted', 'Closed'];

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  enquiryType: EnquiryType;
  selectedKnifeId?: number | null;
  selectedKnifeName?: string | null;
  selectedServiceId?: number | null;
  selectedServiceName?: string | null;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt?: string;
  selectedKnife?: { id: number; name: string; slug: string } | null;
  selectedService?: { id: number; title: string; slug: string } | null;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  enquiryType: EnquiryType;
  message: string;
  selectedKnifeId?: number;
  selectedKnifeName?: string;
  selectedServiceId?: number;
  selectedServiceName?: string;
}

export const ENQUIRY_MESSAGE_PLACEHOLDERS: Record<EnquiryType, string> = {
  General: 'Tell us about your enquiry...',
  'Knife Enquiry': 'Tell us what kind of knife you are looking for...',
  'Custom Knife': 'Tell us about the custom knife you would like made...',
  'Knife Making Course': 'Ask about course dates, pricing, and availability...',
  Engraving: 'Tell us what item you would like engraved and what text/design you want...',
  'Repairs / Sharpening': 'Describe the blade and what repair or sharpening you need...',
  Other: 'Tell us about your enquiry...',
};

export const KNIFE_ENQUIRY_MESSAGE_PLACEHOLDER =
  'Tell us what you would like to know about this knife, or ask us to confirm availability.';
