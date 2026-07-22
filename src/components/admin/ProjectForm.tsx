import React, { useState, useEffect } from 'react';
import { Category, Project, TileSize, MediaType } from '../../types';
import { fetchCategories, createProject, updateProject, uploadMultipleMedia } from '../../lib/supabase';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import { compressMultipleFiles } from '../../lib/imageCompression';
import { Upload, Image, Video, Sparkles, CheckCircle2, LayoutGrid, ArrowLeft, Trash2, Plus, Star, Zap } from 'lucide-react';

interface ProjectFormProps {
  initialProject?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialProject,
  onSuccess,
  onCancel,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState(initialProject?.title || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [categoryId, setCategoryId] = useState(initialProject?.category_id || '');
  const [mediaUrl, setMediaUrl] = useState(initialProject?.media_url || '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    initialProject?.gallery_urls && initialProject.gallery_urls.length > 0
      ? initialProject.gallery_urls
      : initialProject?.media_url
      ? [initialProject.media_url]
      : []
  );
  const [newUrlInput, setNewUrlInput] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(initialProject?.media_type || 'image');
  const [tileSize, setTileSize] = useState<TileSize>(initialProject?.tile_size || 'small');
  const [displayOrder, setDisplayOrder] = useState<number>(initialProject?.display_order || 0);
  const [published, setPublished] = useState<boolean>(initialProject?.published ?? true);
  const [clientName, setClientName] = useState(initialProject?.client_name || '');
  const [year, setYear] = useState(initialProject?.year || '2025');
  const [statsHighlight, setStatsHighlight] = useState(initialProject?.stats_highlight || '');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadCats = async () => {
      try {
        let cats = await fetchCategories();
        if (!cats || cats.length === 0) {
          cats = INITIAL_CATEGORIES;
        }
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err);
        setCategories(INITIAL_CATEGORIES);
        if (!categoryId && INITIAL_CATEGORIES.length > 0) {
          setCategoryId(INITIAL_CATEGORIES[0].id);
        }
      }
    };
    loadCats();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg(null);

    try {
      // Client-side image compression prior to uploading
      const filesToUpload = await compressMultipleFiles(files, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.82,
      });

      const uploadedUrls = await uploadMultipleMedia(filesToUpload);
      const updatedGallery = [...galleryUrls, ...uploadedUrls];
      setGalleryUrls(updatedGallery);

      // Primary cover is the first uploaded image if not set
      if (!mediaUrl || galleryUrls.length === 0) {
        setMediaUrl(uploadedUrls[0]);
      }

      if (files[0].type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
    } catch (err: any) {
      setErrorMsg(`Upload failed: ${err.message || 'Error uploading file(s)'}`);
    } finally {
      setUploading(false);
      // Reset input value to allow re-uploading same file if desired
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    const trimmed = newUrlInput.trim();
    if (!trimmed) return;
    const updated = [...galleryUrls, trimmed];
    setGalleryUrls(updated);
    if (!mediaUrl) {
      setMediaUrl(trimmed);
    }
    setNewUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    const urlToRemove = galleryUrls[index];
    const updated = galleryUrls.filter((_, i) => i !== index);
    setGalleryUrls(updated);

    // If removed item was primary media URL, pick new primary
    if (urlToRemove === mediaUrl) {
      setMediaUrl(updated[0] || '');
    }
  };

  const handleSetPrimaryCover = (url: string) => {
    setMediaUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalMediaUrl = mediaUrl || galleryUrls[0] || '';
    let selectedCatId = categoryId;

    if (!selectedCatId && categories.length > 0) {
      selectedCatId = categories[0].id;
      setCategoryId(selectedCatId);
    }

    if (!title.trim() || !finalMediaUrl || !selectedCatId) {
      setErrorMsg('Please complete all required fields (Title, Category, Media URL/Upload).');
      return;
    }

    const finalGallery = galleryUrls.length > 0 ? galleryUrls : [finalMediaUrl];

    setSaving(true);
    setErrorMsg(null);

    try {
      if (initialProject) {
        await updateProject(initialProject.id, {
          title: title.trim(),
          description: description.trim(),
          category_id: selectedCatId,
          media_url: finalMediaUrl,
          gallery_urls: finalGallery,
          media_type: mediaType,
          tile_size: tileSize,
          display_order: displayOrder,
          published,
          client_name: clientName.trim(),
          year: year.trim(),
          stats_highlight: statsHighlight.trim(),
        });
      } else {
        await createProject({
          title: title.trim(),
          description: description.trim(),
          category_id: selectedCatId,
          media_url: finalMediaUrl,
          gallery_urls: finalGallery,
          media_type: mediaType,
          tile_size: tileSize,
          display_order: displayOrder,
          published,
          client_name: clientName.trim(),
          year: year.trim(),
          stats_highlight: statsHighlight.trim(),
        });
      }
      onSuccess();
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xl font-black uppercase text-white tracking-tight">
              {initialProject ? 'EDIT PROJECT' : 'ADD NEW PROJECT'}
            </h3>
            <p className="text-xs text-neutral-400">
              Configure bento grid tile, multi-image gallery storage, and specs.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs mb-6">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HYPERDRIVE / CYBERTRUCK"
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#D4FF00] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Media Upload / Multi-Image Storage */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Project Media & Gallery Images (Upload 1 or Multiple) *
            </label>
            <span className="text-[10px] font-mono text-[#D4FF00]">
              {galleryUrls.length} {galleryUrls.length === 1 ? 'Image' : 'Images'} Stored
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* File Upload Trigger with Multiple attribute */}
            <label className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 text-xs font-bold text-neutral-300 hover:border-[#D4FF00] hover:text-[#D4FF00] transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                {uploading ? (
                  <Zap className="w-4 h-4 text-[#D4FF00] animate-bounce" />
                ) : (
                  <Upload className="w-4 h-4 text-[#D4FF00]" />
                )}
                <span>{uploading ? 'Compressing & Uploading to Supabase...' : 'Upload Image(s) / Files'}</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 font-normal">
                Auto-resizes & compresses high-res images before upload
              </span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Direct URL Input */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={newUrlInput}
                onChange={(e) => setNewUrlInput(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-[#D4FF00] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="p-3.5 rounded-xl bg-neutral-800 text-[#D4FF00] hover:bg-[#D4FF00] hover:text-black transition-colors"
                title="Add Image URL to Gallery"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails List */}
          {galleryUrls.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                Stored Gallery Assets ({galleryUrls.length}) - Select Primary Cover Tile:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {galleryUrls.map((url, idx) => {
                  const isPrimary = url === mediaUrl;
                  return (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border transition-all ${
                        isPrimary
                          ? 'border-[#D4FF00] shadow-[0_0_15px_rgba(212,255,0,0.3)] ring-2 ring-[#D4FF00]/50'
                          : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <div className="w-full h-20 bg-black">
                        {mediaType === 'video' && idx === 0 ? (
                          <video src={url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        )}
                      </div>

                      {/* Cover Badge */}
                      {isPrimary && (
                        <div className="absolute top-1 left-1 bg-[#D4FF00] text-black font-black text-[8px] uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-black" />
                          Cover
                        </div>
                      )}

                      {/* Action buttons on hover */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryCover(url)}
                            className="px-2 py-0.5 rounded bg-[#D4FF00] text-black font-extrabold text-[9px] uppercase tracking-wider"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded bg-red-950/80 text-red-300 hover:bg-red-800 hover:text-white transition-colors"
                          title="Delete image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Media Type Selector */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-bold uppercase text-neutral-400">Media Format</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 ${
                  mediaType === 'image'
                    ? 'bg-[#D4FF00] text-black'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 ${
                  mediaType === 'video'
                    ? 'bg-[#D4FF00] text-black'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Video
              </button>
            </div>
          </div>
        </div>

        {/* Bento Tile Size Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Bento Grid Tile Size
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'small', label: 'Small (1x1)', desc: 'Standard single tile' },
              { id: 'medium', label: 'Medium (2x1)', desc: 'Wide banner tile' },
              { id: 'large', label: 'Large (2x2)', desc: 'Hero featured tile' },
            ].map((tile) => (
              <button
                type="button"
                key={tile.id}
                onClick={() => setTileSize(tile.id as TileSize)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tileSize === tile.id
                    ? 'bg-neutral-800 border-[#D4FF00] text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-extrabold uppercase text-[#D4FF00] flex items-center gap-1.5 mb-1">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  {tile.label}
                </div>
                <div className="text-[10px] text-neutral-400">{tile.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Client, Year, Stats & Order */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. NIKE"
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2025"
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Stats Highlight
            </label>
            <input
              type="text"
              value={statsHighlight}
              onChange={(e) => setStatsHighlight(e.target.value)}
              placeholder="140M Impressions"
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key campaign overview, scope details, creative execution..."
            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#D4FF00] focus:outline-none resize-none"
          />
        </div>

        {/* Published Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
          <div>
            <span className="text-xs font-bold text-white uppercase block">
              PUBLISH STATUS
            </span>
            <span className="text-[10px] text-neutral-400">
              When enabled, this project will appear live on the public Bento grid gallery.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
              published
                ? 'bg-[#D4FF00] text-black'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            {published ? 'PUBLISHED' : 'DRAFT'}
          </button>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-full bg-neutral-800 text-white font-bold text-xs uppercase"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-shimmer px-8 py-3.5 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest"
          >
            {saving ? 'Saving...' : initialProject ? 'Update Project' : 'Publish to Bento Vault'}
          </button>
        </div>
      </form>
    </div>
  );
};
