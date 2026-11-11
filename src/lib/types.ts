export type Category = string;
export type Brand = string;

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  image: string;
  description: string;
  specs?: Record<string, string>;
  line?: string;
  featured?: boolean;
  active?: boolean;
  sortOrder?: number;
}

export interface Review {
  id: string;
  name: string;
  place: string;
  text: string;
  active?: boolean;
  sortOrder?: number;
}

export interface Promo {
  id: string;
  title: string;
  text: string;
  until: string;
  image: string;
  active?: boolean;
  sortOrder?: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  place: string;
  image: string;
  active?: boolean;
  sortOrder?: number;
}

export interface SiteContacts {
  phone: string;
  phone2: string;
  phone3: string;
  email: string;
  site: string;
  address: string;
  hours: string;
  hoursNote: string;
  socialMax: string;
  socialTelegram: string;
  socialWhatsapp: string;
  deliveryLocal: string;
  deliveryRegions: string;
}

export interface HeroContent {
  headline: string;
  subtitle: string;
  image: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface PageFact {
  n: string;
  label: string;
}

export interface PageStage {
  n: string;
  title: string;
  text: string;
  image: string;
}

export interface AboutPageContent {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  body1: string;
  body2: string;
  facts: PageFact[];
  brandsTitle: string;
  showBrands: boolean;
  metaTitle: string;
  metaDescription: string;
}

export interface ProductionPageContent {
  eyebrow: string;
  title: string;
  lead: string;
  heroImage: string;
  heroCaption: string;
  video1: string;
  video1Poster: string;
  video1Label: string;
  video2: string;
  video2Poster: string;
  video2Label: string;
  stages: PageStage[];
  metaTitle: string;
  metaDescription: string;
}

export interface ContactsPageContent {
  eyebrow: string;
  title: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
}

export interface DeliveryPageContent {
  eyebrow: string;
  title: string;
  lead: string;
  localTitle: string;
  regionsTitle: string;
  metaTitle: string;
  metaDescription: string;
}

export interface SitePages {
  about: AboutPageContent;
  production: ProductionPageContent;
  contacts: ContactsPageContent;
  delivery: DeliveryPageContent;
}

export interface SiteSettings {
  contacts: SiteContacts;
  hero: HeroContent;
  pages: SitePages;
  featuredProductIds: string[];
  metaTitle: string;
  metaDescription: string;
}
