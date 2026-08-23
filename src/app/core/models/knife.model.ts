import { KnifeImage } from './knife-image.model';

export type KnifeAvailability = 'Available' | 'Reserved' | 'Sold' | 'Made to Order';

export const KNIFE_AVAILABILITY_VALUES: KnifeAvailability[] = [
  'Available',
  'Reserved',
  'Sold',
  'Made to Order',
];

export interface Knife {
  id: number;
  name: string;
  slug: string;
  category: string;
  shortDescription?: string | null;
  description?: string | null;
  price?: number | string | null;
  availability: KnifeAvailability;
  steelType?: string | null;
  handleMaterial?: string | null;
  bladeLength?: string | null;
  overallLength?: string | null;
  notes?: string | null;
  featured: boolean;
  featuredOrder?: number | null;
  active: boolean;
  images: KnifeImage[];
  primaryImage?: KnifeImage | null;
  createdAt?: string;
  updatedAt?: string;
}

export const KNIFE_MAX_IMAGES = 4;

export interface KnifePayload {
  name: string;
  category: string;
  price?: number | null;
  availability?: KnifeAvailability;
  shortDescription?: string;
  description?: string;
  steelType?: string;
  handleMaterial?: string;
  bladeLength?: string;
  overallLength?: string;
  notes?: string;
  featured?: boolean;
  active?: boolean;
  images: { imageUrl: string; altText?: string }[];
}
