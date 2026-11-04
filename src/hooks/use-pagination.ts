import * as React from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { PaginationMeta } from '@/types'

interface UsePaginationOptions {
  defaultLimit?: number
  syncWithSearch?: boolean
  /**
   * When this value changes (after the initial mount), page resets to 1.
   * Pass filter values that should restart pagination, e.g. `[status, search]`.
   */
  resetKey?: unknown
}

export interface UsePaginationReturn {
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  canGoNext: (meta?: PaginationMeta) => boolean
  canGoPrevious: (meta?: PaginationMeta) => boolean
  getPageInfo: (meta?: PaginationMeta) => string
}

function toPositiveInt(value: unknown, fallback: number) {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback
}

function serializeResetKey(resetKey: unknown) {
  if (resetKey === undefined) return undefined
  try {
    return JSON.stringify(resetKey)
  } catch {
    return String(resetKey)
  }
}

export function usePagination(
  options: UsePaginationOptions = {},
): UsePaginationReturn {
  const { defaultLimit = 10, syncWithSearch = true, resetKey } = options

  const search = useSearch({ strict: false }) as unknown as Record<
    string,
    unknown
  >
  const navigate = useNavigate()
  const [localPage, setLocalPage] = React.useState(1)
  const [localLimit, setLocalLimit] = React.useState(defaultLimit)
  const previousSerializedResetKeyRef = React.useRef<string | undefined>(
    undefined,
  )
  const serializedResetKey = serializeResetKey(resetKey)

  React.useEffect(() => {
    if (!syncWithSearch) {
      setLocalLimit(defaultLimit)
    }
  }, [defaultLimit, syncWithSearch])

  const page = React.useMemo(() => {
    if (!syncWithSearch) return localPage
    return toPositiveInt(search.page, 1)
  }, [syncWithSearch, localPage, search.page])

  const limit = React.useMemo(() => {
    if (!syncWithSearch) return localLimit
    return toPositiveInt(search.limit, defaultLimit)
  }, [syncWithSearch, localLimit, search.limit, defaultLimit])

  const updateSearchParams = React.useCallback(
    (updates: Record<string, string | number>) => {
      void navigate({
        to: '.',
        search: (previous: Record<string, unknown>) => ({
          ...previous,
          ...updates,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const setPage = React.useCallback(
    (newPage: number) => {
      const nextPage = Math.max(1, newPage)
      if (syncWithSearch) {
        updateSearchParams({ page: nextPage })
        return
      }
      setLocalPage(nextPage)
    },
    [syncWithSearch, updateSearchParams],
  )

  React.useEffect(() => {
    if (serializedResetKey === undefined) return

    if (previousSerializedResetKeyRef.current === undefined) {
      previousSerializedResetKeyRef.current = serializedResetKey
      return
    }

    if (previousSerializedResetKeyRef.current === serializedResetKey) {
      return
    }

    previousSerializedResetKeyRef.current = serializedResetKey
    setPage(1)
  }, [serializedResetKey, setPage])

  const setLimit = React.useCallback(
    (newLimit: number) => {
      const nextLimit = Math.max(1, newLimit)
      if (syncWithSearch) {
        updateSearchParams({ limit: nextLimit, page: 1 })
        return
      }
      setLocalLimit(nextLimit)
      setLocalPage(1)
    },
    [syncWithSearch, updateSearchParams],
  )

  const nextPage = React.useCallback(() => {
    setPage(page + 1)
  }, [page, setPage])

  const previousPage = React.useCallback(() => {
    setPage(page - 1)
  }, [page, setPage])

  const goToPage = React.useCallback(
    (targetPage: number) => {
      setPage(targetPage)
    },
    [setPage],
  )

  const canGoNext = React.useCallback((meta?: PaginationMeta) => {
    return meta ? meta.page < meta.totalPages : false
  }, [])

  const canGoPrevious = React.useCallback(
    (meta?: PaginationMeta) => {
      return meta ? meta.page > 1 : page > 1
    },
    [page],
  )

  const getPageInfo = React.useCallback((meta?: PaginationMeta) => {
    if (!meta) return ''

    const start = (meta.page - 1) * meta.limit + 1
    const end = Math.min(meta.page * meta.limit, meta.totalCount)

    return `Showing ${start}-${end} of ${meta.totalCount} results`
  }, [])

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    goToPage,
    canGoNext,
    canGoPrevious,
    getPageInfo,
  }
}
