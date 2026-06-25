import { galleryImages, services } from '../data/content'

export const HERO_VIDEO_SRC = '/video/hero.mp4?v=original'

export const CRITICAL_IMAGES = [
  '/brand/logo.png',
  ...services.map((s) => s.image),
  ...galleryImages.map((g) => g.src),
  '/brand/curtain-light.png',
] as const
