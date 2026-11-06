'use client';

import { useState, useTransition } from 'react';
import { Trash2, Edit2, FolderOpen, Plus, Check, X, Globe, Loader2, Tag } from 'lucide-react';
import { deleteCategory, renameCategory, createCategory } from '@/actions/admin';
import { useToast } from '@/context/ToastContext';

interface Category {
  name: string;
  productCount: number;
  nameKm: string;
}

interface Props {
  categories: Category[];
}

export default function AdminCategoriesContent({ categories }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newNameKm, setNewNameKm] = useState('');
  const toast = useToast();

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createNameEn, setCreateNameEn] = useState('');
  const [createNameKm, setCreateNameKm] = useState('');
  const [translating, setTranslating] = useState(false);

  async function handleAutoTranslate() {
    if (!createNameEn.trim() || translating) return;
    setTranslating(true);
    try {
      const encodedText = encodeURIComponent(createNameEn);
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|km`, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const data = (await response.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        setCreateNameKm(data.responseData.translatedText);
      }
    } catch { /* ignore */ } finally {
      setTranslating(false);
    }
  }

  function handleStartEdit(category: string, nameKm: string) {
    setEditingCategory(category);
    setNewName(category);
    setNewNameKm(nameKm);
  }

  function handleCancelEdit() {
    setEditingCategory(null);
    setNewName('');
    setNewNameKm('');
  }

  function handleSaveRename(oldName: string) {
    if (!newName.trim()) {
      handleCancelEdit();
      return;
    }

    startTransition(async () => {
      try {
        await renameCategory(oldName, newName.trim(), newNameKm.trim() || undefined);
        toast.success(`Category renamed to "${newName}"`);
        setEditingCategory(null);
        window.location.reload();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to rename category';
        console.error('Rename error:', error);
        toast.error(message);
      }
    });
  }

  function handleDelete(category: string) {
    if (!window.confirm(`Delete category "${category}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteCategory(category);
        toast.success(`Category "${category}" deleted successfully`);
        window.location.reload();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete category';
        console.error('Delete error:', error);
        toast.error(message);
      }
    });
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!createNameEn.trim()) return;

    const formData = new FormData();
    formData.set('nameEn', createNameEn.trim());
    if (createNameKm.trim()) formData.set('nameKm', createNameKm.trim());

    startTransition(async () => {
      try {
        await createCategory(formData);
        toast.success(`Category "${createNameEn}" created successfully`);
        setShowCreateForm(false);
        setCreateNameEn('');
        setCreateNameKm('');
        window.location.reload();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create category';
        console.error('Create error:', error);
        toast.error(message);
      }
    });
  }

  const input = 'border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-black text-slate-900">Category Management</h1>
        </div>
        <p className="text-slate-600">Manage product categories with bilingual (English + Khmer) support.</p>
      </div>

      {/* Create New Category Button / Form */}
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="mb-6 flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create New Category
        </button>
      ) : (
        <form onSubmit={handleCreate} className="mb-6 bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-600" />
              Create New Category
            </h3>
            <button
              type="button"
              onClick={() => { setShowCreateForm(false); setCreateNameEn(''); setCreateNameKm(''); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* English */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={createNameEn}
                onChange={e => setCreateNameEn(e.target.value)}
                placeholder="e.g. Electronics"
                required
                autoFocus
                className={input}
              />
            </div>

            {/* Khmer */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category Name (Khmer) <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={createNameKm}
                  onChange={e => setCreateNameKm(e.target.value)}
                  placeholder="ឧ. អេឡិចត្រូនិច"
                  className={input}
                />
                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={translating || !createNameEn.trim()}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  Auto
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={isPending || !createNameEn.trim()}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isPending ? 'Creating...' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={() => { setShowCreateForm(false); setCreateNameEn(''); setCreateNameKm(''); }}
              className="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              {editingCategory === category.name ? (
                // Edit Mode — EN + KH fields
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">English</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Khmer</label>
                    <input
                      type="text"
                      value={newNameKm}
                      onChange={(e) => setNewNameKm(e.target.value)}
                      placeholder="ភាសាខ្មែរ (optional)"
                      className="w-full px-4 py-2.5 border-2 border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveRename(category.name)}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-50 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{category.name}</h3>
                  {category.nameKm && (
                    <p className="text-sm text-indigo-600 font-medium mb-2">{category.nameKm}</p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                      {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(category.name, category.nameKm)}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-50 border-2 border-indigo-300 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4" />
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(category.name)}
                      disabled={isPending || category.productCount > 0}
                      title={category.productCount > 0 ? 'Cannot delete category with products' : 'Delete category'}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 border-2 border-red-300 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200">
          <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-700 font-bold text-lg">No Categories Found</p>
          <p className="text-slate-600 text-sm">Create a new category above or add products with categories.</p>
        </div>
      )}
    </div>
  );
}
