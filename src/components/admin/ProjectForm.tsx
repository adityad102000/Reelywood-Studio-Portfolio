import React, { useState, useEffect } from 'react';
import { Category, Project, TileSize, MediaType } from '../../types';
import { fetchCategories, createProject, updateProject, uploadMedia } from '../../lib/supabase';
import { Upload, Image, Video, Sparkles, CheckCircle2, LayoutGrid, ArrowLeft } from 'lucide-react';

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
      const cats = await fetchCategories();
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    };
    loadCats();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setErrorMsg(null);

    // Detect media type
    if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else {
      setMediaType('image');
    }

    try {
      const url = await uploadMedia(file);
      setMediaUrl(url);
    } catch (err: any) {
      setErrorMsg(`Upload failed: ${err.message || 'Error uploading file'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl || !categoryId) {
      setErrorMsg('Please complete all required fields (Title, Category, Media URL/Upload).');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (initialProject) {
        await updateProject(initialProject.id, {
          title,
          description,
          category_id: categoryId,
          media_url: mediaUrl,
          media_type: mediaType,
          tile_size: tileSize,
          display_order: displayOrder,
          published,
          client_name: clientName,
          year,
          stats_highlight: statsHighlight,
        });
      } else {
        await createProject({
          title,
          description,
          category_id: categoryId,
          media_url: mediaUrl,
          media_type: mediaType,
          tile_size: tileSize,
          display_order: displayOrder,
          published,
          client_name: clientName,
          year,
          stats_highlight: statsHighlight,
        });
      }
      onSuccess();
    } catch (err: any) {
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
              Configure bento grid tile, media, and campaign specs.
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

        {/* Media Upload / URL */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Project Media (Image or Video) *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* File Upload Trigger */}
            <label className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 text-xs font-bold text-neutral-300 hover:border-[#D4FF00] hover:text-[#D4FF00] transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-[#D4FF00]" />
              <span>{uploading ? 'Uploading to Storage...' : 'Upload File to Supabase Storage'}</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Direct URL Input */}
            <div>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Or paste media URL (https://...)"
                className="w-full px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-[#D4FF00] focus:outline-none"
              />
            </div>
          </div>

          {/* Media Type Switch & Preview */}
          {mediaUrl && (
            <div className="flex items-center justify-between pt-2">
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

              <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-700 bg-black shrink-0">
                {mediaType === 'video' ? (
                  <video src={mediaUrl} className="w-full h-full object-cover" />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          )}
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
            disabled={saving}
            className="btn-shimmer px-8 py-3.5 rounded-full bg-[#D4FF00] text-black font-black text-xs uppercase tracking-widest"
          >
            {saving ? 'Saving...' : initialProject ? 'Update Project' : 'Publish to Bento Vault'}
          </button>
        </div>
      </form>
    </div>
  );
};
