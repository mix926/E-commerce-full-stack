'use client';

import { useTransition, useState } from 'react';
import { createProduct } from '@/actions/admin';
import { PlusCircle, Tag } from 'lucide-react';

interface NewProductFormProps {
  categories: string[];
}

export default function NewProductForm({ categories }: NewProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Ensure the right category value is used
    if (useCustomCategory) {
      formData.set('category', customCategory.trim());
    } else {
      formData.set('category', selectedCategory);
    }
    startTransition(async () => {
      await createProduct(formData);
    });
  }

  const inputClass = 'border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className={labelClass}>Product Name</label>
        <input name="name" type="text" required placeholder="e.g. Wireless Headphones" className={inputClass} />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" required rows={3} placeholder="Describe the product..."
          className={`${inputClass} resize-none`} />
      </div>

      {/* Price + Stock row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price ($)</label>
          <input name="price" type="number" step="0.01" min="0" required placeholder="0.00" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input name="stock" type="number" min="0" required placeholder="100" className={inputClass} />
        </div>
      </div>

      {/* Image URL + preview */}
      <div>
        <label className={labelClass}>Image URL</label>
        <input
          name="image"
          type="text"
          required
          placeholder="https://example.com/image.jpg"
          className={inputClass}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {imageUrl && (
          <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={imageUrl} alt="preview" className="w-full h-full object-cover" onError={() => setImageUrl('')} />
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label className={labelClass + ' flex items-center gap-1.5'}>
          <Tag className="w-4 h-4 text-blue-500" /> Category
        </label>

        {!useCustomCategory ? (
          <div className="space-y-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={inputClass}
              required={!useCustomCategory}
            >
              <option value="">— Select existing category —</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => { setUseCustomCategory(true); setSelectedCategory(''); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create a new category
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Furniture"
                required={useCustomCategory}
                className={inputClass}
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-400">
              This will create a new category and add it to the navbar automatically.
            </p>
            <button
              type="button"
              onClick={() => { setUseCustomCategory(false); setCustomCategory(''); }}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Use existing category instead
            </button>
          </div>
        )}

        {/* Existing selected category chips */}
        {!useCustomCategory && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || (!useCustomCategory && !selectedCategory) || (useCustomCategory && !customCategory.trim())}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Creating Product...' : 'Create Product'}
      </button>
    </form>
  );
}
