import { create } from 'zustand';
import type { DrawerType, ModalType } from '@/types';
import type { Product } from '@/types/product';

interface UIState {
  // Drawers
  activeDrawer: DrawerType;
  openDrawer: (drawer: DrawerType) => void;
  closeDrawer: () => void;
  toggleDrawer: (drawer: DrawerType) => void;

  // Modals
  activeModal: ModalType;
  quickViewProduct: Product | null;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Search overlay
  searchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;

  // Announcement bar
  announcementIndex: number;
  setAnnouncementIndex: (index: number) => void;

  // Page loading
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;

  // Toast / notifications (simple)
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Drawers
  activeDrawer: null,
  openDrawer: (drawer) => set({ activeDrawer: drawer }),
  closeDrawer: () => set({ activeDrawer: null }),
  toggleDrawer: (drawer) =>
    set((s) => ({ activeDrawer: s.activeDrawer === drawer ? null : drawer })),

  // Modals
  activeModal: null,
  quickViewProduct: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null, quickViewProduct: null }),
  openQuickView: (product) =>
    set({ activeModal: 'quickview', quickViewProduct: product }),
  closeQuickView: () =>
    set({ activeModal: null, quickViewProduct: null }),

  // Search
  searchOpen: false,
  searchQuery: '',
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Announcement bar
  announcementIndex: 0,
  setAnnouncementIndex: (index) => set({ announcementIndex: index }),

  // Page loading
  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),

  // Toast
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3500);
  },
  hideToast: () => set({ toast: null }),
}));
