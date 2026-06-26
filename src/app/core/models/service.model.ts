export type ServiceEnquiryType =
  | 'Custom Knife'
  | 'Knife Making Course'
  | 'Engraving'
  | 'Repairs / Sharpening'
  | 'General'
  | 'Other';

export const SERVICE_ENQUIRY_TYPE_OPTIONS: ServiceEnquiryType[] = [
  'Custom Knife',
  'Knife Making Course',
  'Engraving',
  'Repairs / Sharpening',
  'General',
  'Other',
];

export interface Service {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  enquiryType: ServiceEnquiryType;
  imageUrl?: string | null;
  active: boolean;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicePayload {
  title: string;
  shortDescription?: string;
  description?: string;
  enquiryType: ServiceEnquiryType;
  imageUrl?: string;
  active?: boolean;
  featured?: boolean;
}
