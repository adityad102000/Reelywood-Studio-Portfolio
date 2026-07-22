import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { fetchCategories, createCategory } from '../../lib/supabase';
import { FolderPlus, Tag, Check, RefreshCw } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setAdding(true);
    setMsg(null);
    try {
      const created = await createCategory(newCatName);
      setNewCatName('');
      setMsg(`Category "${created.name}" created successfully!`);
      await loadCategories();
    } catch (err: any) {
      setMsg(`Error: ${err.message || 'Failed to create category'}`);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-xl font-black uppercase text-white tracking-tight">
            CATEGORY <span className="text-[#D4FF00]">MANAGEMENT</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Define project categories stored in Supabase for portfolio taxonomy.
          </p>
        </div>
        <button
          onClick={loadCategories}
          className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[#D4FF00] text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="flex gap-3">
        <input
          type="text"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          placeholder="New Category Name (e.g. 3D Spatial Audio)"
          className="flex-1 px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none"
        />
        <button
          type="submit"
          disabled={adding || !newCatName.trim()}
          className="btn-shimmer px-6 py-3 rounded-xl bg-[#D4FF00] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </form>

      {/* Existing Categories List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center gap-3 text-xs font-bold text-white uppercase tracking-wider"
          >
            <Tag className="w-4 h-4 text-[#D4FF00]" />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
