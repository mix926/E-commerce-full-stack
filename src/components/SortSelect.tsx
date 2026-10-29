'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface SortSelectProps {
  defaultValue: string;
}

export default function SortSelect({ defaultValue }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const SORT_OPTIONS = [
    { label: t('sort.newest'), value: 'newest' },
    { label: t('sort.priceAsc'), value: 'price_asc' },
    { label: t('sort.priceDesc'), value: 'price_desc' },
    { label: t('sort.rating'), value: 'rating' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={handleChange}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
