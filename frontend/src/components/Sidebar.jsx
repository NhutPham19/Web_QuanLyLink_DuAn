import React from 'react';
import { Layers, HelpCircle, Plus, Edit2, Trash2, X } from 'lucide-react';
import { CategoryIcon } from '../constants/icons';

export function Sidebar({
  categories,
  activeCategory,
  onSelectCategory,
  onOpenAddCategory,
  onOpenEditCategory,
  onOpenDeleteCategory,
  totalLinksCount,
  uncategorizedCount,
  isOpenMobile,
  onCloseMobile,
}) {
  const content = (
    <div className="flex flex-col h-full">
      {/* Category header & Add button */}
      <div className="flex items-center justify-between px-3 py-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Danh mục
        </span>
        <button
          onClick={onOpenAddCategory}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
          title="Tạo danh mục mới"
        >
          <Plus size={14} />
          <span>Mới</span>
        </button>
      </div>

      {/* Main navigation list */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {/* All Links */}
        <button
          onClick={() => {
            onSelectCategory(null);
            if (isOpenMobile) onCloseMobile();
          }}
          className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeCategory === null
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                activeCategory === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
              }`}
            >
              <Layers size={15} />
            </div>
            <span>Tất cả liên kết</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              activeCategory === null
                ? 'bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {totalLinksCount}
          </span>
        </button>

        {/* Custom Categories */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <div
              key={cat.id}
              className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
              onClick={() => {
                onSelectCategory(cat.id);
                if (isOpenMobile) onCloseMobile();
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
                >
                  <CategoryIcon name={cat.icon} size={15} />
                </div>
                <span className="truncate">{cat.name}</span>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Action buttons (revealed on hover) */}
                <div className="hidden group-hover:flex items-center gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditCategory(cat);
                    }}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    title="Chỉnh sửa danh mục"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDeleteCategory(cat);
                    }}
                    className="p-1 rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Xóa danh mục"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Count badge */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium transition-opacity ${
                    isActive
                      ? 'bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:opacity-60'
                  }`}
                >
                  {cat.link_count || 0}
                </span>
              </div>
            </div>
          );
        })}

        {/* Uncategorized Links */}
        <button
          onClick={() => {
            onSelectCategory('uncategorized');
            if (isOpenMobile) onCloseMobile();
          }}
          className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeCategory === 'uncategorized'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                activeCategory === 'uncategorized'
                  ? 'bg-zinc-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <HelpCircle size={15} />
            </div>
            <span>Chưa phân loại</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              activeCategory === 'uncategorized'
                ? 'bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {uncategorizedCount}
          </span>
        </button>
      </nav>

      {/* Footer info */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-between px-2">
        <span>Tổng cộng: {totalLinksCount} link</span>
        <span>{categories.length} danh mục</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 py-6 pr-6 border-r border-zinc-200 dark:border-zinc-800 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-zinc-900 p-4 h-full shadow-2xl z-10 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Menu Danh mục</span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
