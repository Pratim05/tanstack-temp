const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/centers': 'Centers',
  '/user-management': 'User Management',
  '/lead-management': 'Lead Management',
  '/lead-distribution': 'Lead Distribution',
  '/settings/profile': 'Profile Settings',
  '/settings/smtp': 'Email Settings (SMTP)',
}

function normalizePath(pathname: string) {
  if (pathname === '/') return pathname
  return pathname.replace(/\/+$/, '')
}

export function getDashboardPageTitle(pathname: string) {
  const path = normalizePath(pathname)

  if (PAGE_TITLES[path]) {
    return PAGE_TITLES[path]
  }

  const segment = path.split('/').filter(Boolean).at(-1)
  if (!segment) return 'Dashboard'

  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
