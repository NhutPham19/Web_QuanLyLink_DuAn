import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, item, type }) {
  if (!isOpen || !item) return null;

  const isCategory = type === 'category';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 overflow-hidden transform transition-all p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {isCategory ? 'Xác nhận xóa danh mục' : 'Xác nhận xóa liên kết'}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Bạn có chắc chắn muốn xóa{' '}
              <strong className="text-zinc-800 dark:text-zinc-200">"{item.name}"</strong>?
            </p>

            {isCategory && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                Lưu ý: Các liên kết trong danh mục này sẽ <strong>không bị xóa</strong>, mà sẽ được chuyển sang mục "Chưa phân loại".
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(item.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-all shadow-md shadow-rose-600/20"
          >
            <Trash2 size={16} />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
