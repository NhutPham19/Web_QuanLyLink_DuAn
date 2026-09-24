export const RESOURCE_TYPES = [
  { id: 'project', label: 'Dự án (Web App)', color: '#6366f1', bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
  { id: 'library', label: 'Thư viện / Code', color: '#a855f7', bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  { id: 'tool', label: 'Công cụ (Tool)', color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  { id: 'document', label: 'Tài liệu (Doc)', color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
];

export const PRESET_FRONTEND_HOSTS = [
  'Vercel',
  'Netlify',
  'Cloudflare Pages',
  'GitHub Pages',
  'Firebase Hosting',
  'Render',
  'Localhost',
];

export const PRESET_BACKEND_HOSTS = [
  'Koyeb',
  'Render',
  'Railway',
  'Fly.io',
  'Oracle Cloud VPS',
  'VPS Ubuntu',
  'AWS',
  'Localhost',
];

export const PRESET_DATABASE_HOSTS = [
  'Turso (LibSQL)',
  'Supabase',
  'Neon Postgres',
  'MongoDB Atlas',
  'SQLite Local',
  'Firebase Firestore',
  'PlanetScale',
  'MySQL Cloud',
];

export const POPULAR_TECHS = [
  'React',
  'Next.js',
  'Vue',
  'Nuxt',
  'Tailwind CSS',
  'Node.js',
  'Express',
  'Python',
  'FastAPI',
  'Django',
  'Docker',
  'SQLite',
  'PostgreSQL',
  'MongoDB',
  'TypeScript',
  'Java',
  'Spring Boot',
  'Golang',
];

// Helper to get Resource Type object
export function getResourceType(id) {
  return RESOURCE_TYPES.find((r) => r.id === id) || RESOURCE_TYPES[0];
}
