import React, { useState, useEffect } from 'react';
import { X, Folder, AlertCircle } from 'lucide-react';
import { AVAILABLE_ICONS, PRESET_COLORS, CategoryIcon } from '../constants/icons';

export function CategoryModal({ isOpen, onClose, onSubmit, editingCategory }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('folder');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setColor(editingCategory.color || '#6366f1');
      setIcon(editingCategory.icon || 'folder');
    } else {
      setName('');
      setColor('#6366f1');
      setIcon('folder');
    }
    setError('');
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        name: name.trim(),
        color,
        icon,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}22`, color: color }}
            >
              <CategoryIcon name={icon} size={18} />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Tên danh mục <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Công việc, Học tập, Giải trí..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Màu sắc
            </label>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {PRESET_COLORS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setColor(item.value)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === item.value
                      ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900'
                      : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: item.value }}
                  title={item.name}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-0 p-0 overflow-hidden"
                title="Màu tùy chọn"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Biểu tượng
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/30">
              {AVAILABLE_ICONS.map((item) => {
                const IconComponent = item.Icon;
                const isSelected = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                    title={item.label}
                  >
                    <IconComponent size={18} />
                    <span className="text-[10px] truncate max-w-full mt-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview */}
          <div className="pt-2">
            <span className="block text-[11px] text-zinc-400 mb-1">Xem trước hiển thị:</span>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium"
              style={{
                backgroundColor: `${color}18`,
                color: color,
                borderColor: `${color}33`,
              }}
            >
              <CategoryIcon name={icon} size={16} />
              <span>{name.trim() || 'Tên danh mục'}</span>
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
              {submitting ? 'Đang lưu...' : editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
