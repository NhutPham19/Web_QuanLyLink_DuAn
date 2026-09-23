import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Edit2, Trash2, Globe } from 'lucide-react';
import { CategoryIcon } from '../constants/icons';

function getDomain(urlStr) {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return urlStr;
  }
}

export function LinkCard({ link, viewMode, onEdit, onDelete, onCopyToast }) {
  const [copied, setCopied] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const domain = getDomain(link.url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

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

  // LIST VIEW FORMAT
  if (viewMode === 'list') {
    return (
      <div className="group flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600/70 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Favicon */}
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60">
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

          {/* Title & URL */}
          <div className="min-w-0 flex-1 pr-3">
            <div className="flex items-center gap-2">
              <h3
                onClick={handleOpen}
                className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                title={link.name}
              >
                {link.name}
              </h3>
              {link.category_name && (
                <span
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0"
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
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{domain}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
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
        {/* Top: Favicon & Category Badge */}
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

          {link.category_name ? (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full truncate max-w-[150px]"
              style={{
                backgroundColor: `${link.category_color}18`,
                color: link.category_color,
                borderColor: `${link.category_color}33`,
                borderWidth: '1px',
              }}
            >
              <CategoryIcon name={link.category_icon} size={12} />
              <span className="truncate">{link.category_name}</span>
            </span>
          ) : (
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
              Chưa phân loại
            </span>
          )}
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
        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mb-4">
          {domain}
        </p>
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
