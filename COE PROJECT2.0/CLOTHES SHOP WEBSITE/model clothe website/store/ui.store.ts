import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ── Types ─────────────────────────────────────────────────────────────────── //

type ModalId =
  | "quick-view"
  | "size-guide"
  | "auth"
  | "confirm-delete"
  | "search"
  | null;

type DrawerId = "cart" | "filters" | "nav-mobile" | "wishlist" | null;

interface UIState {
  // Drawers
  activeDrawer: DrawerId;
  openDrawer: (id: DrawerId) => void;
  closeDrawer: () => void;
  toggleDrawer: (id: DrawerId) => void;
  isDrawerOpen: (id: DrawerId) => boolean;

  // Modals
  activeModal: ModalId;
  modalData: Record<string, unknown>;
  openModal: (id: ModalId, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  isModalOpen: (id: ModalId) => boolean;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;

  // Navigation
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;

  // Announcement bar
  isAnnouncementVisible: boolean;
  dismissAnnouncement: () => void;

  // Page loading
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

// ── Store ──────────────────────────────────────────────────────────────────── //

export const useUIStore = create<UIState>()(
  immer((set, get) => ({
    // ── Drawers ─────────────────────────────────────────────────────────── //
    activeDrawer: null,

    openDrawer: (id) => set((state) => { state.activeDrawer = id; }),
    closeDrawer: () => set((state) => { state.activeDrawer = null; }),

    toggleDrawer: (id) =>
      set((state) => {
        state.activeDrawer = state.activeDrawer === id ? null : id;
      }),

    isDrawerOpen: (id) => get().activeDrawer === id,

    // ── Modals ──────────────────────────────────────────────────────────── //
    activeModal: null,
    modalData: {},

    openModal: (id, data = {}) =>
      set((state) => {
        state.activeModal = id;
        state.modalData = data;
      }),

    closeModal: () =>
      set((state) => {
        state.activeModal = null;
        state.modalData = {};
      }),

    isModalOpen: (id) => get().activeModal === id,

    // ── Search ──────────────────────────────────────────────────────────── //
    isSearchOpen: false,
    searchQuery: "",

    openSearch: () =>
      set((state) => {
        state.isSearchOpen = true;
      }),

    closeSearch: () =>
      set((state) => {
        state.isSearchOpen = false;
        state.searchQuery = "";
      }),

    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),

    // ── Navigation ──────────────────────────────────────────────────────── //
    isMobileNavOpen: false,

    toggleMobileNav: () =>
      set((state) => {
        state.isMobileNavOpen = !state.isMobileNavOpen;
      }),

    closeMobileNav: () =>
      set((state) => {
        state.isMobileNavOpen = false;
      }),

    // ── Announcement ────────────────────────────────────────────────────── //
    isAnnouncementVisible: true,

    dismissAnnouncement: () =>
      set((state) => {
        state.isAnnouncementVisible = false;
      }),

    // ── Page loading ─────────────────────────────────────────────────────── //
    isPageLoading: false,

    setPageLoading: (loading) =>
      set((state) => {
        state.isPageLoading = loading;
      }),
  })),
);
