'use client';

import { useTransition, useState } from 'react';
import { updateProduct } from '@/actions/admin';
import type { Product } from '@prisma/client';
import { PlusCircle, Tag, Ruler, Palette, Star } from 'lucide-react';

const PRESET_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'];
const PRESET_COLORS = [
  { name: 'Black',  hex: '#1f2937' },
  { name: 'White',  hex: '#f9fafb' },
  { name: 'Red',    hex: '#ef4444' },
  { name: 'Blue',   hex: '#3b82f6' },
  { name: 'Green',  hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink',   hex: '#ec4899' },
  { name: 'Gray',   hex: '#9ca3af' },
  { name: 'Brown',  hex: '#92400e' },
];

interface EditProductFormProps { product: Product; categories: string[]; }

export default function EditProductForm({ product, categories }: EditProductFormProps) {
  const [isPending, startTransition]            = useTransition();
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [selectedCategory, setSelectedCategory]   = useState(product.category);
  const [customCategory, setCustomCategory]       = useState('');
  const [imageUrl, setImageUrl]                   = useState(product.image);
  const [selectedSizes, setSelectedSizes]   = useState<string[]>(
    product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    product.colors ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : []
  );
  const [featured, setFeatured] = useState(product.featured ?? false);

  const toggleSize  = (s: string) => setSelectedSizes(p  => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleColor = (c: string) => setSelectedColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('category', useCustomCategory ? customCategory.trim() : selectedCategory);
    formData.set('image',    imageUrl);
    formData.set('sizes',    selectedSizes.join(','));
    formData.set('colors',   selectedColors.join(','));
    formData.set('featured', String(featured));
    startTransition(async () => { await updateProduct.bind(null, product.id)(formData); });
  }

  const input = 'border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm';
  const label = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label className={label}>Product Name</label>
        <input name="name" type="text" required defaultValue={product.name} className={input} />
      </div>

      <div>
        <label className={label}>Description</label>
        <textarea name="description" required rows={3} defaultValue={product.description} className={`${input} resize-none`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Price ($)</label>
          <input name="price" type="number" step="0.01" min="0" required defaultValue={product.price} className={input} />
        </div>
        <div>
          <label className={label}>Stock</label>
          <input name="stock" type="number" min="0" required defaultValue={product.stock} className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Image URL</label>
        <input name="image" type="text" required className={input} value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        {imageUrl && (
          <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label className={`${label} flex items-center gap-1.5`}>
          <Tag className="w-4 h-4 text-indigo-500" /> Category
        </label>
        {!useCustomCategory ? (
          <div className="space-y-2">
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className={input}>
              <option value="">— Select category —</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button type="button" onClick={() => { setUseCustomCategory(true); setSelectedCategory(''); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              <PlusCircle className="w-3.5 h-3.5" /> Create a new category
            </button>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {categories.map(cat => (
                <button key={cat} type="button" onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                    selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <input type="text" value={customCategory} onChange={e => setCustomCategory(e.target.value)}
              placeholder="e.g. Furniture" required className={input} autoFocus />
            <p className="text-xs text-gray-400">New category appears in the navbar automatically.</p>
            <button type="button" onClick={() => { setUseCustomCategory(false); setSelectedCategory(product.category); setCustomCategory(''); }}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700">← Use existing category</button>
          </div>
        )}
      </div>

      {/* Sizes */}
      <div>
        <label className={`${label} flex items-center gap-1.5`}>
          <Ruler className="w-4 h-4 text-indigo-500" /> Sizes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESET_SIZES.map(s => (
            <button key={s} type="button" onClick={() => toggleSize(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                selectedSizes.includes(s) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
              {s}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Or type custom: 28, 30, 32…" className={`${input} text-xs`}
          onBlur={e => { const v = e.target.value.trim(); if (v) { v.split(',').map(s => s.trim()).filter(Boolean).forEach(s => { if (!selectedSizes.includes(s)) setSelectedSizes(p => [...p, s]); }); e.target.value = ''; } }} />
        {selectedSizes.length > 0 && (
          <p className="text-xs text-indigo-600 mt-1.5 font-medium">Selected: {selectedSizes.join(', ')}</p>
        )}
      </div>

      {/* Colors */}
      <div>
        <label className={`${label} flex items-center gap-1.5`}>
          <Palette className="w-4 h-4 text-indigo-500" /> Colors <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2.5 mb-2">
          {PRESET_COLORS.map(c => (
            <button key={c.name} type="button" onClick={() => toggleColor(c.name)} title={c.name}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                selectedColors.includes(c.name) ? 'border-indigo-600 scale-110 shadow-md' : 'border-transparent hover:border-gray-300'}`}
              style={{ background: c.hex }}>
              {selectedColors.includes(c.name) && (
                <span className="flex items-center justify-center w-full h-full text-white text-xs font-black">✓</span>
              )}
            </button>
          ))}
        </div>
        {selectedColors.length > 0 && (
          <p className="text-xs text-indigo-600 font-medium">Selected: {selectedColors.join(', ')}</p>
        )}
      </div>

      {/* Featured toggle */}
      <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <div>
            <p className="text-sm font-bold text-gray-900">Featured Product</p>
            <p className="text-xs text-gray-400">Show in homepage Top Rated section</p>
          </div>
        </div>
        <button type="button" onClick={() => setFeatured(p => !p)}
          className={`w-12 h-6 rounded-full transition-all duration-200 relative ${featured ? 'bg-amber-500' : 'bg-gray-200'}`}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${featured ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>

      <button type="submit"
        disabled={isPending || (!useCustomCategory && !selectedCategory) || (useCustomCategory && !customCategory.trim())}
        className="w-full py-3 rounded-xl font-black text-sm text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,.3)' }}>
        {isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}
