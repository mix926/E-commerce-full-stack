'use client';

import { useState, useTransition } from 'react';
import { Trash2, Edit2, FolderOpen, Plus, Check, X } from 'lucide-react';
import { deleteCategory, renameCategory } from '@/actions/admin';
import { useToast } from '@/context/ToastContext';

interface Category {
  name: string;
  productCount: number;
}

interface Props {
  categories: Category[];
}

export default function AdminCategoriesContent({ categories }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const toast = useToast();

  function handleStartEdit(category: string) {
    setEditingCategory(category);
    setNewName(category);
  }

  function handleCancelEdit() {
    setEditingCategory(null);
    setNewName('');
  }

  function handleSaveRename(oldName: string) {
    if (!newName.trim() || newName === oldName) {
      handleCancelEdit();
      return;
    }

    startTransition(async () => {
      try {
        await renameCategory(oldName, newName);
        toast.success(`Category renamed to "${newName}"`);
        setEditingCategory(null);
        // Refresh the page to show updated categories
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
        // Refresh the page to show updated categories
        window.location.reload();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete category';
        console.error('Delete error:', error);
        toast.error(message);
      }
    });
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-black text-slate-900">Category Management</h1>
        </div>
        <p className="text-slate-600">Manage product categories. Delete empty categories or rename existing ones.</p>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              {editingCategory === category.name ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
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
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{category.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                      {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(category.name)}
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
          <p className="text-slate-600 text-sm">Create products to add categories</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          How to Add New Categories
        </h4>
        <p className="text-blue-800 text-sm">
          New categories are created automatically when you add a product with a custom category name. There&apos;s no separate form to add categories—they emerge from your products.
        </p>
      </div>
    </div>
  );
}
