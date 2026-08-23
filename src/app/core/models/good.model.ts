import { GoodImage } from './good-image.model';

export type GoodAvailability = 'Available' | 'Reserved' | 'Sold' | 'Made to Order';

export const GOOD_AVAILABILITY_VALUES: GoodAvailability[] = [
  'Available',
  'Reserved',
  'Sold',
  'Made to Order',
];

export interface Good {
  id: number;
  name: string;
  slug: string;
  category: string;
  shortDescription?: string | null;
  description?: string | null;
  price?: number | string | null;
  availability: GoodAvailability;
  material?: string | null;
  finish?: string | null;
  dimensions?: string | null;
  personalization?: string | null;
  notes?: string | null;
  featured: boolean;
  featuredOrder?: number | null;
  active: boolean;
  images: GoodImage[];
  primaryImage?: GoodImage | null;
  createdAt?: string;
  updatedAt?: string;
}

export const GOOD_MAX_IMAGES = 4;

export interface GoodPayload {
  name: string;
  category: string;
  price?: number | null;
  availability?: GoodAvailability;
  shortDescription?: string;
  description?: string;
  material?: string;
  finish?: string;
  dimensions?: string;
  personalization?: string;
  notes?: string;
  featured?: boolean;
  active?: boolean;
  images: { imageUrl: string; altText?: string }[];
}
