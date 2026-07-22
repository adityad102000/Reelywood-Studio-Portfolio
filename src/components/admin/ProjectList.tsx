import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { fetchProjects, updateProject, deleteProject } from '../../lib/supabase';
import { Edit2, Trash2, Eye, EyeOff, Plus, RefreshCw, LayoutGrid } from 'lucide-react';

interface ProjectListProps {
  onAddNew: () => void;
  onEdit: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onAddNew, onEdit }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects(true); // include drafts
      setProjects(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProjects();
  }, []);

  const handleTogglePublished = async (project: Project) => {
    try {
      const updated = await updateProject(project.id, {
        published: !project.published,
      });
      setProjects(projects.map((p) => (p.id === project.id ? updated : p)));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-xl font-black uppercase text-white tracking-tight">
            MANAGED <span className="text-[#D4FF00]">PROJECTS</span> ({projects.length})
          </h3>
          <p className="text-xs text-neutral-400">
            Publish, edit, reorder, or delete portfolio projects live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllProjects}
            className="p-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onAddNew}
            className="btn-shimmer px-5 py-2.5 rounded-full bg-[#D4FF00] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Table / Cards */}
      {loading ? (
        <div className="text-center py-12 text-xs text-neutral-400 font-mono animate-pulse">
          Fetching projects from database...
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-neutral-950 rounded-2xl border border-dashed border-neutral-800">
          <LayoutGrid className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-white uppercase mb-1">No Projects Found</p>
          <p className="text-xs text-neutral-400 mb-4">Click "Add Project" above to create your first portfolio tile.</p>
          <button
            onClick={onAddNew}
            className="px-5 py-2 rounded-full bg-[#D4FF00] text-black font-bold text-xs uppercase"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {/* Media Thumbnail */}
                <div className="w-16 h-12 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                  {project.media_type === 'video' ? (
                    <video src={project.media_url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={project.media_url} alt={project.title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-black uppercase text-white tracking-tight">
                      {project.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-[#D4FF00] uppercase">
                      {project.tile_size}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-2">
                    <span>{project.category?.name || 'Uncategorized'}</span>
                    <span>•</span>
                    <span>Order: {project.display_order}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleTogglePublished(project)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase flex items-center gap-1.5 ${
                    project.published
                      ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {project.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{project.published ? 'Live' : 'Draft'}</span>
                </button>

                <button
                  onClick={() => onEdit(project)}
                  className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
