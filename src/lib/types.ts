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
  email: string;
  site: string;
  address: string;
}

export interface HeroContent {
  headline: string;
  subtitle: string;
  image: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface SiteSettings {
  contacts: SiteContacts;
  hero: HeroContent;
  featuredProductIds: string[];
  metaTitle: string;
  metaDescription: string;
}
