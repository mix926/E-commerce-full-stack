'use client';

import React, { createContext, useContext, useSyncExternalStore, useCallback } from 'react';
import { useToast } from './ToastContext';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

interface WishlistContextValue {
  items: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const STORAGE_KEY = 'eshop_wishlist_items';

let memoryCache: WishlistItem[] = [];
let memoryCacheRaw = '';

function getSnapshot(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '[]';
    if (raw !== memoryCacheRaw) {
      memoryCacheRaw = raw;
      memoryCache = JSON.parse(raw);
    }
    return memoryCache;
  } catch {
    return [];
  }
}

function getServerSnapshot(): WishlistItem[] {
  return [];
}

function subscribe(notify: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', notify);
  window.addEventListener('wishlist-change', notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('wishlist-change', notify);
  };
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toast = useToast();

  const saveToStorage = useCallback((updated: WishlistItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlist-change'));
    } catch {
      // Storage error
    }
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const toggleWishlist = useCallback(
    (product: WishlistItem) => {
      if (items.some((item) => item.id === product.id)) {
        const updated = items.filter((item) => item.id !== product.id);
        saveToStorage(updated);
        toast.info(`Removed "${product.name}" from your wishlist`);
      } else {
        const updated = [...items, product];
        saveToStorage(updated);
        toast.success(`Added "${product.name}" to your wishlist! ❤️`);
      }
    },
    [items, saveToStorage, toast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.id === productId);
      const updated = items.filter((i) => i.id !== productId);
      saveToStorage(updated);
      if (item) {
        toast.info(`Removed "${item.name}" from your wishlist`);
      }
    },
    [items, saveToStorage, toast]
  );

  const clearWishlist = useCallback(() => {
    saveToStorage([]);
  }, [saveToStorage]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
