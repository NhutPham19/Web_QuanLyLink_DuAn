import React, { useState, useEffect, useMemo } from 'react';
import { api } from './api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LinkCard } from './components/LinkCard';
import { LinkModal } from './components/LinkModal';
import { CategoryModal } from './components/CategoryModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { Plus, ArrowUpDown, Bookmark, Search, Layers, RefreshCw } from 'lucide-react';

export default function App() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('linkvault_view') || 'grid');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.getItem('linkvault_theme')) {
      return localStorage.getItem('linkvault_theme') === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modal states
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, type: 'link' });
  const [toast, setToast] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('linkvault_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('linkvault_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync View Mode
  useEffect(() => {
    localStorage.setItem('linkvault_view', viewMode);
  }, [viewMode]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Load initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [catsData, linksData] = await Promise.all([
        api.getCategories(),
        api.getLinks(),
      ]);
      setCategories(catsData);
      setLinks(linksData);
    } catch (err) {
      showToast(err.message || 'Lỗi tải dữ liệu từ máy chủ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter & Sort Links
  const filteredLinks = useMemo(() => {
    return links
      .filter((link) => {
        // Filter by category
        if (activeCategory === 'uncategorized') {
          if (link.category_id !== null && link.category_id !== undefined) return false;
        } else if (activeCategory !== null) {
          if (link.category_id !== activeCategory) return false;
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = link.name?.toLowerCase().includes(q);
          const urlMatch = link.url?.toLowerCase().includes(q);
          return nameMatch || urlMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        }
        if (sortBy === 'az') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'za') {
          return (b.name || '').localeCompare(a.name || '');
        }
        return 0;
      });
  }, [links, activeCategory, searchQuery, sortBy]);

  // Counts
  const totalLinksCount = links.length;
  const uncategorizedCount = links.filter(
    (l) => l.category_id === null || l.category_id === undefined
  ).length;

  // Active Category Title
  const activeCategoryTitle = useMemo(() => {
    if (activeCategory === null) return 'Tất cả liên kết';
    if (activeCategory === 'uncategorized') return 'Chưa phân loại';
    const found = categories.find((c) => c.id === activeCategory);
    return found ? found.name : 'Danh mục';
  }, [activeCategory, categories]);

  // Handlers for Links
  const handleSaveLink = async (payload) => {
    if (editingLink) {
      const updated = await api.updateLink(editingLink.id, payload);
      setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      showToast('Đã cập nhật liên kết thành công!');
    } else {
      const created = await api.createLink(payload);
      setLinks((prev) => [created, ...prev]);
      showToast('Đã thêm liên kết mới thành công!');
    }
    // Refresh categories to update link_count
    api.getCategories().then(setCategories).catch(console.error);
  };

  const handleDeleteLink = async (id) => {
    try {
      await api.deleteLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      showToast('Đã xóa liên kết!');
      // Refresh categories count
      api.getCategories().then(setCategories).catch(console.error);
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa link', 'error');
    }
  };

  // Handlers for Categories
  const handleSaveCategory = async (payload) => {
    if (editingCategory) {
      const updated = await api.updateCategory(editingCategory.id, payload);
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
      );
      // Also update linked links in state
      setLinks((prev) =>
        prev.map((l) =>
          l.category_id === updated.id
            ? {
                ...l,
                category_name: updated.name,
                category_color: updated.color,
                category_icon: updated.icon,
              }
            : l
        )
      );
      showToast('Đã cập nhật danh mục!');
    } else {
      const created = await api.createCategory(payload);
      setCategories((prev) => [...prev, created]);
      showToast('Đã tạo danh mục mới!');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      // Reset activeCategory if deleted
      if (activeCategory === id) setActiveCategory(null);
      // Invalidate links category_id to null
      setLinks((prev) =>
        prev.map((l) =>
          l.category_id === id
            ? { ...l, category_id: null, category_name: null, category_color: null, category_icon: null }
            : l
        )
      );
      showToast('Đã xóa danh mục thành công!');
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa danh mục', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onOpenAddLink={() => {
          setEditingLink(null);
          setLinkModalOpen(true);
        }}
        onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenAddCategory={() => {
            setEditingCategory(null);
            setCategoryModalOpen(true);
          }}
          onOpenEditCategory={(cat) => {
            setEditingCategory(cat);
            setCategoryModalOpen(true);
          }}
          onOpenDeleteCategory={(cat) => {
            setDeleteModal({ isOpen: true, item: cat, type: 'category' });
          }}
          totalLinksCount={totalLinksCount}
          uncategorizedCount={uncategorizedCount}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 py-6 md:pl-8 min-w-0">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {activeCategoryTitle}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                  {filteredLinks.length}
                </span>
              </div>
              {searchQuery && (
                <p className="text-xs text-zinc-500 mt-1">
                  Kết quả tìm kiếm cho: <span className="font-semibold text-zinc-700 dark:text-zinc-300">"{searchQuery}"</span>
                </p>
              )}
            </div>

            {/* Sort & Quick Refresh */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <ArrowUpDown size={14} />
                <span>Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs cursor-pointer font-medium shadow-2xs"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="az">Tên A-Z</option>
                  <option value="za">Tên Z-A</option>
                </select>
              </div>

              <button
                onClick={fetchData}
                disabled={loading}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
                title="Tải lại dữ liệu"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Links Grid or List */}
          {loading && links.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl animate-pulse p-4"
                />
              ))}
            </div>
          ) : filteredLinks.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                {searchQuery ? <Search size={26} /> : <Bookmark size={26} />}
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {searchQuery ? 'Không tìm thấy liên kết phù hợp' : 'Chưa có liên kết nào'}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
                {searchQuery
                  ? `Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm.`
                  : activeCategory !== null
                  ? 'Danh mục này hiện chưa có liên kết nào. Hãy thêm ngay liên kết đầu tiên!'
                  : 'Hãy bắt đầu lưu trữ và quản lý các liên kết hữu ích của bạn ngay bây giờ.'}
              </p>
              <button
                onClick={() => {
                  setEditingLink(null);
                  setLinkModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-600/20"
              >
                <Plus size={16} />
                <span>Thêm liên kết mới</span>
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'flex flex-col space-y-2.5'
              }
            >
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  viewMode={viewMode}
                  onEdit={(l) => {
                    setEditingLink(l);
                    setLinkModalOpen(true);
                  }}
                  onDelete={(l) => {
                    setDeleteModal({ isOpen: true, item: l, type: 'link' });
                  }}
                  onCopyToast={showToast}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onSubmit={handleSaveLink}
        editingLink={editingLink}
        categories={categories}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleSaveCategory}
        editingCategory={editingCategory}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, type: 'link' })}
        onConfirm={(id) => {
          if (deleteModal.type === 'link') {
            handleDeleteLink(id);
          } else {
            handleDeleteCategory(id);
          }
        }}
        item={deleteModal.item}
        type={deleteModal.type}
      />
    </div>
  );
}
