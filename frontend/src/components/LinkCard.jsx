import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Edit2, Trash2, Server, Database, Globe, Layers, Tag } from 'lucide-react';
import { CategoryIcon } from '../constants/icons';
import { getResourceType } from '../constants/tags';

function getDomain(urlStr) {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return urlStr;
  }
}

export function LinkCard({ link, viewMode, onEdit, onDelete, onCopyToast, onTagClick }) {
  const [copied, setCopied] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const domain = getDomain(link.url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  const resType = getResourceType(link.resource_type);
  const techList = Array.isArray(link.tech_stack) ? link.tech_stack : [];

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    if (onCopyToast) onCopyToast('Đã sao chép liên kết vào clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = (e) => {
    e.stopPropagation();
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    if (onTagClick) onTagClick(tag);
  };

  // LIST VIEW FORMAT
  if (viewMode === 'list') {
    return (
      <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600/70 hover:shadow-sm transition-all duration-200 gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          {/* Favicon */}
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60 mt-0.5 sm:mt-0">
            {!faviconError ? (
              <img
                src={faviconUrl}
                alt=""
                className="w-4 h-4 object-contain"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <span className="text-xs font-bold uppercase text-zinc-500">
                {domain[0] || 'L'}
              </span>
            )}
          </div>

          {/* Title, Category & Infra */}
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                onClick={handleOpen}
                className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                title={link.name}
              >
                {link.name}
              </h3>

              {/* Resource Type */}
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${resType.bg} ${resType.text} border ${resType.border}`}>
                {resType.label}
              </span>

              {/* Category */}
              {link.category_name && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: `${link.category_color}18`,
                    color: link.category_color,
                    borderColor: `${link.category_color}33`,
                    borderWidth: '1px',
                  }}
                >
                  <CategoryIcon name={link.category_icon} size={11} />
                  <span>{link.category_name}</span>
                </span>
              )}
            </div>

            {/* URL domain and hosting info */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 truncate mt-1 flex-wrap">
              <span>{domain}</span>

              {link.frontend_host && (
                <button
                  onClick={(e) => handleTagClick(e, link.frontend_host)}
                  className="hover:underline text-indigo-500 dark:text-indigo-400 text-[11px] flex items-center gap-0.5"
                >
                  <span>🌐 {link.frontend_host}</span>
                </button>
              )}
              {link.backend_host && (
                <button
                  onClick={(e) => handleTagClick(e, link.backend_host)}
                  className="hover:underline text-emerald-500 dark:text-emerald-400 text-[11px] flex items-center gap-0.5"
                >
                  <span>⚙️ {link.backend_host}</span>
                </button>
              )}
              {link.database_host && (
                <button
                  onClick={(e) => handleTagClick(e, link.database_host)}
                  className="hover:underline text-purple-500 dark:text-purple-400 text-[11px] flex items-center gap-0.5"
                >
                  <span>🗄️ {link.database_host}</span>
                </button>
              )}
            </div>

            {/* Tech chips */}
            {techList.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                {techList.slice(0, 5).map((tech) => (
                  <button
                    key={tech}
                    onClick={(e) => handleTagClick(e, tech)}
                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    #{tech}
                  </button>
                ))}
                {techList.length > 5 && (
                  <span className="text-[10px] text-zinc-400">+{techList.length - 5}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Sao chép URL"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleOpen}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Mở liên kết"
          >
            <ExternalLink size={16} />
          </button>
          <button
            onClick={() => onEdit(link)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(link)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Xóa link"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  // GRID VIEW FORMAT
  return (
    <div className="group relative flex flex-col justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600/70 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200">
      <div>
        {/* Top: Favicon & Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
            {!faviconError ? (
              <img
                src={faviconUrl}
                alt=""
                className="w-5 h-5 object-contain"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <span className="text-sm font-bold uppercase text-zinc-500">
                {domain[0] || 'L'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-hidden">
            {/* Resource Type */}
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${resType.bg} ${resType.text} border ${resType.border} shrink-0`}>
              {resType.label}
            </span>

            {/* Category */}
            {link.category_name ? (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full truncate max-w-[120px]"
                style={{
                  backgroundColor: `${link.category_color}18`,
                  color: link.category_color,
                  borderColor: `${link.category_color}33`,
                  borderWidth: '1px',
                }}
              >
                <CategoryIcon name={link.category_icon} size={11} />
                <span className="truncate">{link.category_name}</span>
              </span>
            ) : (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 shrink-0">
                Chưa phân loại
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={handleOpen}
          className="font-semibold text-zinc-900 dark:text-zinc-100 text-base line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors mb-1"
          title={link.name}
        >
          {link.name}
        </h3>

        {/* Domain name */}
        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mb-3">
          {domain}
        </p>

        {/* Infrastructure & Hosting Badges */}
        {(link.frontend_host || link.backend_host || link.database_host) && (
          <div className="flex flex-wrap gap-1.5 mb-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
            {link.frontend_host && (
              <button
                type="button"
                onClick={(e) => handleTagClick(e, link.frontend_host)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                title={`Lọc theo Frontend: ${link.frontend_host}`}
              >
                <span>🌐 FE:</span>
                <span className="font-semibold">{link.frontend_host}</span>
              </button>
            )}

            {link.backend_host && (
              <button
                type="button"
                onClick={(e) => handleTagClick(e, link.backend_host)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                title={`Lọc theo Backend: ${link.backend_host}`}
              >
                <span>⚙️ BE:</span>
                <span className="font-semibold">{link.backend_host}</span>
              </button>
            )}

            {link.database_host && (
              <button
                type="button"
                onClick={(e) => handleTagClick(e, link.database_host)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
                title={`Lọc theo CSDL: ${link.database_host}`}
              >
                <span>🗄️ DB:</span>
                <span className="font-semibold">{link.database_host}</span>
              </button>
            )}
          </div>
        )}

        {/* Tech Stack Chips */}
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {techList.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={(e) => handleTagClick(e, tech)}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title={`Lọc theo công nghệ: ${tech}`}
              >
                #{tech}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Action Bar */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Sao chép liên kết"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Đã chép' : 'Chép'}</span>
          </button>

          <button
            onClick={handleOpen}
            className="flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Mở tab mới"
          >
            <ExternalLink size={14} />
            <span>Mở</span>
          </button>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onEdit(link)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(link)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Xóa link"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
