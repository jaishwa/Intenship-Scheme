export * from './product';
export * from './cart';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  image?: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export interface AnnouncementMessage {
  id: string;
  text: string;
  link?: string;
  linkText?: string;
}

export interface ReviewAggregate {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export type DrawerType = 'cart' | 'wishlist' | 'menu' | 'search' | null;
export type ModalType = 'quickview' | 'auth' | 'size-guide' | null;
