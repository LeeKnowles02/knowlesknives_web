export type GalleryCategory = 'Knives' | 'Workshop' | 'Engraving' | 'Courses' | 'Details' | 'Other';

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
