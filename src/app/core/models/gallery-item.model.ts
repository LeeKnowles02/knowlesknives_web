export type GalleryCategory = 'Knives' | 'Workshop' | 'Engraving' | 'Courses' | 'Details' | 'Other';

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: GalleryCategory;
  active: boolean;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Knives',
  'Workshop',
  'Engraving',
  'Courses',
  'Details',
  'Other',
];
