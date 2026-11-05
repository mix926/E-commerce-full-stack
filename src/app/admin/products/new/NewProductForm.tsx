'use client';

import { useTransition, useState } from 'react';
import { createProduct } from '@/actions/admin';
import { extractPinterestImage } from '@/actions/image';
import { PlusCircle, Tag, Ruler, Palette, Star, Loader2, Globe } from 'lucide-react';

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

interface NewProductFormProps { categories: string[]; }

export default function NewProductForm({ categories }: NewProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [selectedCategory, setSelectedCategory]   = useState('');
  const [customCategory, setCustomCategory]       = useState('');
  const [categoryTranslation, setCategoryTranslation] = useState<string>('');
  const [translatingCategory, setTranslatingCategory] = useState(false);
  const [imageUrl, setImageUrl]                   = useState('');
  const [isLoadingImage, setIsLoadingImage]       = useState(false);
  const [selectedSizes, setSelectedSizes]         = useState<string[]>([]);
  const [selectedColors, setSelectedColors]       = useState<string[]>([]);
  const [featured, setFeatured]                   = useState(false);

  const toggleSize  = (s: string) => setSelectedSizes(p  => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleColor = (c: string) => setSelectedColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  async function handleImageUrlChange(value: string) {
    setImageUrl(value);
    
    // Auto-extract image from Pinterest links
    if (value.includes('pinterest.com')) {
      setIsLoadingImage(true);
      try {
        const extracted = await extractPinterestImage(value);
        setImageUrl(extracted);
      } catch (error) {
        console.error('Failed to extract image:', error);
        // Keep the original URL if extraction fails
      } finally {
        setIsLoadingImage(false);
      }
    }
  }

  async function handleCustomCategoryChange(value: string) {
    setCustomCategory(value);

    // Auto-translate category name to Khmer
    if (value.trim().length > 2) {
      setTranslatingCategory(true);
      try {
        // Simple translation using the API
        const encodedText = encodeURIComponent(value);
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|km`, {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });

        const data = (await response.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          setCategoryTranslation(data.responseData.translatedText);
        }
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setTranslatingCategory(false);
      }
    } else {
      setCategoryTranslation('');
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('category', useCustomCategory ? customCategory.trim() : selectedCategory);
    formData.set('sizes',    selectedSizes.join(','));
    formData.set('colors',   selectedColors.join(','));
    formData.set('featured', String(featured));
    startTransition(async () => { await createProduct(formData); });
  }

  const input = 'border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm';
  const label = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Name */}
      <div>
        <label className={label}>Product Name</label>
        <input name="name" type="text" required placeholder="e.g. Wireless Headphones" className={input} />
      </div>

      {/* Description */}
      <div>
        <label className={label}>Description</label>
        <textarea name="description" required rows={3} placeholder="Describe the product&hellip;" className={`${input} resize-none`} />
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Price ($)</label>
          <input name="price" type="number" step="0.01" min="0" required placeholder="0.00" className={input} />
        </div>
        <div>
          <label className={label}>Stock</label>
          <input name="stock" type="number" min="0" required placeholder="100" className={input} />
        </div>
      </div>

      {/* Image */}
      <div>
        <label className={label}>Image URL</label>
        <div className="flex gap-2">
          <input name="image" type="text" required placeholder="https://… or paste Pinterest link" className={input}
            value={imageUrl} onChange={e => handleImageUrlChange(e.target.value)} disabled={isLoadingImage} />
          {isLoadingImage && <Loader2 className="w-5 h-5 animate-spin text-indigo-500 mt-2.5" />}
        </div>
        {imageUrl && (
          <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={imageUrl} alt="preview" className="w-full h-full object-cover" onError={() => setImageUrl('')} />
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1">💡 Tip: Paste Pinterest links directly&mdash;we&apos;ll extract the image for you!</p>
      </div>

      {/* Category */}
      <div>
        <label className={`${label} flex items-center gap-1.5`}>
          <Tag className="w-4 h-4 text-indigo-500" /> Category
        </label>
        {!useCustomCategory ? (
          <div className="space-y-2">
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className={input} required>
              <option value="">— Select existing category —</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button type="button" onClick={() => { setUseCustomCategory(true); setSelectedCategory(''); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              <PlusCircle className="w-3.5 h-3.5" /> Create a new category
            </button>
            <div className="flex flex-wrap gap-1.5 mt-2">
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
          <div className="space-y-3">
            <input type="text" value={customCategory} onChange={e => handleCustomCategoryChange(e.target.value)}
              placeholder="e.g. Furniture" required className={input} autoFocus />
            <p className="text-xs text-gray-400">New category appears in the navbar automatically.</p>
            
            {/* Auto-translation preview */}
            {customCategory.trim().length > 2 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900">Auto-Translated to Khmer</span>
                  {translatingCategory && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
                </div>
                {categoryTranslation ? (
                  <p className="text-sm text-blue-800 font-medium">{categoryTranslation}</p>
                ) : (
                  <p className="text-xs text-blue-600">Translating...</p>
                )}
              </div>
            )}

            <button type="button" onClick={() => { setUseCustomCategory(false); setCustomCategory(''); setCategoryTranslation(''); }}
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
        <input name="sizesCustom" type="text" placeholder="Or type custom: 28, 30, 32…"
          className={`${input} text-xs`}
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
            <button key={c.name} type="button" onClick={() => toggleColor(c.name)}
              title={c.name}
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
        disabled={isPending || !imageUrl || (!useCustomCategory && !selectedCategory) || (useCustomCategory && !customCategory.trim())}
        className="w-full py-3 rounded-xl font-black text-sm text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,.3)' }}>
        {isPending ? 'Creating Product…' : 'Create Product'}
      </button>
    </form>
  );
}
