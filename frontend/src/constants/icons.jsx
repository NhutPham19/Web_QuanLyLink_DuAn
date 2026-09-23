import React from 'react';
import {
  Briefcase,
  Globe,
  Code,
  Folder,
  Star,
  Bookmark,
  BookOpen,
  Layout,
  ShoppingBag,
  Music,
  Video,
  Cpu,
  Terminal,
  Heart,
  Sparkles,
  Coffee,
  FileText,
  Compass,
  MessageSquare,
  Zap,
} from 'lucide-react';

export const AVAILABLE_ICONS = [
  { id: 'globe', label: 'Globe', Icon: Globe },
  { id: 'briefcase', label: 'Briefcase', Icon: Briefcase },
  { id: 'code', label: 'Code', Icon: Code },
  { id: 'folder', label: 'Folder', Icon: Folder },
  { id: 'star', label: 'Star', Icon: Star },
  { id: 'bookmark', label: 'Bookmark', Icon: Bookmark },
  { id: 'book-open', label: 'Book', Icon: BookOpen },
  { id: 'layout', label: 'Layout', Icon: Layout },
  { id: 'shopping-bag', label: 'Shop', Icon: ShoppingBag },
  { id: 'music', label: 'Music', Icon: Music },
  { id: 'video', label: 'Video', Icon: Video },
  { id: 'cpu', label: 'Tech', Icon: Cpu },
  { id: 'terminal', label: 'Terminal', Icon: Terminal },
  { id: 'heart', label: 'Heart', Icon: Heart },
  { id: 'sparkles', label: 'AI/Magic', Icon: Sparkles },
  { id: 'coffee', label: 'Coffee', Icon: Coffee },
  { id: 'file-text', label: 'Document', Icon: FileText },
  { id: 'compass', label: 'Compass', Icon: Compass },
  { id: 'message-square', label: 'Chat', Icon: MessageSquare },
  { id: 'zap', label: 'Energy', Icon: Zap },
];

export const PRESET_COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Slate', value: '#64748b' },
];

export function CategoryIcon({ name, size = 18, className = '' }) {
  const found = AVAILABLE_ICONS.find((item) => item.id === name);
  const IconComponent = found ? found.Icon : Folder;
  return <IconComponent size={size} className={className} />;
}
