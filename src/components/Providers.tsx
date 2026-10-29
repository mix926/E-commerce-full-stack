'use client';

import React from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
