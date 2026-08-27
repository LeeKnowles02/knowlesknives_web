export type GalleryCategory = 'Knives' | 'Workshop' | 'Engraving' | 'Courses' | 'Details' | 'Other';

export type GallerySourceType = 'knife' | 'service' | 'manual';

/** Manual gallery items managed in admin (numeric id). */
export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  category: GalleryCategory;
  active: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Alias used by admin screens — always numeric ids from /admin/gallery. */
export type AdminGalleryItem = GalleryItem;

/** Public gallery entries — manual items plus knife/service primary images. */
export interface PublicGalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: GalleryCategory;
  active: boolean;
  sortOrder?: number;
  sourceType: GallerySourceType;
  linkUrl?: string;
}

export interface GalleryItemPayload {
  title: string;
  imageUrl: string;
  category: GalleryCategory;
  active: boolean;
  sortOrder?: number;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Knives',
  'Workshop',
  'Engraving',
  'Courses',
  'Details',
  'Other',
];
