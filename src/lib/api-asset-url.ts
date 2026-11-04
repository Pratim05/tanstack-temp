import { API_URL } from '@/config/env'

export function toApiAssetUrl(path?: string | null) {
  if (!path) {
    return null
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
}
