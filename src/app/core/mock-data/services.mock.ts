import { Service } from '../models/service.model';

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Custom Knife Making',
    slug: 'custom-knife-making',
    shortDescription: 'Bespoke knives designed and forged to your exact requirements.',
    description:
      'From initial consultation through to final delivery, we guide you through every step of creating a one-of-a-kind knife. Choose your steel, handle material, blade profile, and finishing details. Each commission is a collaboration between maker and client.',
    imageUrl: 'assets/images/workshop.svg',
    enquiryType: 'custom-knife',
    active: true,
    featured: true,
  },
  {
    id: '2',
    title: 'Knife Making Courses',
    slug: 'knife-making-courses',
    shortDescription: 'Learn the fundamentals of blade forging in our hands-on workshops.',
    description:
      'Our knife making courses offer an immersive introduction to the craft. Over one or two days, you will learn forging, grinding, heat treating, and handle fitting under expert guidance. Courses run periodically throughout the year — enquire about upcoming dates, pricing, and availability to secure your place.',
    imageUrl: 'assets/images/course.svg',
    enquiryType: 'course',
    active: true,
    featured: true,
  },
  {
    id: '3',
    title: 'Custom Engraving',
    slug: 'custom-engraving',
    shortDescription: 'Personalised engraving for knives, boards, gifts, and custom items.',
    description:
      'Add a personal touch with hand-engraved initials, logos, dates, or custom artwork. Engraving is available for knives, cutting boards, gift items, and other bespoke pieces. We work with you to create designs that complement the material and purpose of each item.',
    imageUrl: 'assets/images/engraving.svg',
    enquiryType: 'engraving',
    active: true,
    featured: false,
  },
  {
    id: '4',
    title: 'Blade Resharpening & Repairs',
    slug: 'blade-resharpening-repairs',
    shortDescription: 'Professional sharpening and repair services to restore your blades.',
    description:
      'Keep your knives performing at their best with our professional resharpening service. We also undertake repairs including handle replacement, tip repair, and restoration of vintage or damaged blades. Enquire with details of your knife and we will advise on options and pricing.',
    imageUrl: 'assets/images/knife-2.svg',
    enquiryType: 'repairs',
    active: true,
    featured: false,
  },
];
