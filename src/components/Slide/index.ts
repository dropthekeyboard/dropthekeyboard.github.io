// Export all slide components
export { default as Slide001 } from './Slide001';
export { default as Slide002 } from './Slide002';
export { default as Slide003 } from './Slide003';
export { default as Slide004 } from './Slide004';
export { default as Slide005 } from './Slide005';
export { default as Slide006 } from './Slide006';
export { default as Slide007 } from './Slide007';
export { default as Slide008 } from './Slide008';
export { default as Slide009 } from './Slide009';
export { default as Slide010 } from './Slide010';
export { default as Slide011 } from './Slide011';
export { default as Slide012 } from './Slide012';
export { default as Slide013 } from './Slide013';
export { default as Slide014 } from './Slide014';
export { default as Slide015 } from './Slide015';
export { default as Slide016 } from './Slide016';
export { default as Slide017 } from './Slide017';

// Export existing slides
export { default as SlideGSAPSection } from './SlideGSAPSection';
export { default as GSAPSlidesPage } from './GSAPSlidesPage';

// Array of all slides for easy iteration
export const allSlides = [
  'Slide001',
  'Slide002',
  'Slide003',
  'Slide004',
  'Slide005',
  'Slide006',
  'Slide007',
  'Slide008',
  'Slide009',
  'Slide010',
  'Slide011',
  'Slide012',
  'Slide013',
  'Slide014',
  'Slide015',
  'Slide016',
] as const;

export type SlideNames = (typeof allSlides)[number];
