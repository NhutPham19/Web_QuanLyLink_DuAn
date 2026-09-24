import React, { useState, useEffect } from 'react';
import { X, Link2, Folder, AlertCircle, Server, Database, Globe, Layers, Plus, Check } from 'lucide-react';
import { RESOURCE_TYPES, PRESET_FRONTEND_HOSTS, PRESET_BACKEND_HOSTS, PRESET_DATABASE_HOSTS, POPULAR_TECHS } from '../constants/tags';

export function LinkModal({ isOpen, onClose, onSubmit, editingLink, categories }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [resourceType, setResourceType] = useState('project');
  const [frontendHost, setFrontendHost] = useState('');
  const [backendHost, setBackendHost] = useState('');
  const [databaseHost, setDatabaseHost] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingLink) {
      setName(editingLink.name || '');
      setUrl(editingLink.url || '');
      setCategoryId(editingLink.category_id || '');
      setResourceType(editingLink.resource_type || 'project');
      setFrontendHost(editingLink.frontend_host || '');
      setBackendHost(editingLink.backend_host || '');
      setDatabaseHost(editingLink.database_host || '');
      setTechStack(Array.isArray(editingLink.tech_stack) ? editingLink.tech_stack : []);
    } else {
      setName('');
      setUrl('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setResourceType('project');
      setFrontendHost('');
      setBackendHost('');
      setDatabaseHost('');
      setTechStack([]);
    }
    setTagInput('');
    setError('');
  }, [editingLink, categories, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (tagToAdd) => {
    const clean = tagToAdd.trim();
    if (!clean) return;
    if (!techStack.includes(clean)) {
      setTechStack([...techStack, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTechStack(techStack.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên liên kết');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl) {
      setError('Vui lòng nhập URL');
      return;
    }

    // Auto prepend https:// if missing protocol
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch {
      setError('Địa chỉ URL không hợp lệ');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        name: name.trim(),
        url: finalUrl,
        category_id: categoryId ? Number(categoryId) : null,
        resource_type: resourceType,
        frontend_host: frontendHost.trim() || null,
        backend_host: backendHost.trim() || null,
        database_host: databaseHost.trim() || null,
        tech_stack: techStack,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 overflow-hidden my-6 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Link2 size={18} />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {editingLink ? 'Chỉnh sửa liên kết' : 'Thêm liên kết mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Basic Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Địa chỉ URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: https://laplichthidau.vercel.app hoặc github.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (!name && e.target.value.includes('.')) {
                    try {
                      const clean = e.target.value.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
                      if (clean) setName(clean);
                    } catch {}
                  }
                }}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Tên liên kết <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: App Lập Lịch Cầu Lông"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Danh mục
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all appearance-none cursor-pointer"
                  >
                    <option value="">(Chưa phân loại)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <Folder size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Type Pills */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Loại tài nguyên
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {RESOURCE_TYPES.map((rt) => {
                  const isSelected = resourceType === rt.id;
                  return (
                    <button
                      key={rt.id}
                      type="button"
                      onClick={() => setResourceType(rt.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        isSelected
                          ? `${rt.bg} ${rt.text} ${rt.border} ring-2 ring-indigo-500/30 font-semibold shadow-xs`
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {rt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Section: Hosting & Infrastructure */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Server size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Hạ tầng & Nền tảng Deploy (Tùy chọn)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Frontend Host */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  🌐 Frontend Host
                </label>
                <input
                  type="text"
                  list="fe-hosts"
                  placeholder="VD: Vercel, Netlify..."
                  value={frontendHost}
                  onChange={(e) => setFrontendHost(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <datalist id="fe-hosts">
                  {PRESET_FRONTEND_HOSTS.map((h) => (
                    <option key={h} value={h} />
                  ))}
                </datalist>
              </div>

              {/* Backend Host */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  ⚙️ Backend Host
                </label>
                <input
                  type="text"
                  list="be-hosts"
                  placeholder="VD: Koyeb, Render, VPS..."
                  value={backendHost}
                  onChange={(e) => setBackendHost(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <datalist id="be-hosts">
                  {PRESET_BACKEND_HOSTS.map((h) => (
                    <option key={h} value={h} />
                  ))}
                </datalist>
              </div>

              {/* Database Host */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  🗄️ Cơ sở dữ liệu (CSDL)
                </label>
                <input
                  type="text"
                  list="db-hosts"
                  placeholder="VD: Turso, SQLite, Supabase..."
                  value={databaseHost}
                  onChange={(e) => setDatabaseHost(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <datalist id="db-hosts">
                  {PRESET_DATABASE_HOSTS.map((h) => (
                    <option key={h} value={h} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Section: Tech Stack & Libraries */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Layers size={16} className="text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Thư viện & Công nghệ (Tech Stack)
              </h3>
            </div>

            {/* Custom Tag Input */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Gõ tên công nghệ và nhấn Enter (VD: React, Tailwind, Docker...)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus size={14} />
                <span>Thêm</span>
              </button>
            </div>

            {/* Selected Tags */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-zinc-100/60 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80 mb-3">
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-zinc-400 hover:text-rose-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Click-to-add Popular Techs */}
            <div>
              <span className="block text-[11px] text-zinc-400 mb-1.5">Gợi ý chọn nhanh:</span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {POPULAR_TECHS.map((tech) => {
                  const isSelected = techStack.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveTag(tech) : handleAddTag(tech))}
                      className={`text-[11px] px-2 py-1 rounded-md border transition-all ${
                        isSelected
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800 font-semibold'
                          : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 transition-all shadow-md shadow-indigo-600/20"
            >
              {submitting ? 'Đang lưu...' : editingLink ? 'Lưu thay đổi' : 'Thêm liên kết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
