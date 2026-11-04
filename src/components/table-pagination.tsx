import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { PaginationMeta } from '@/types'
import { cn } from '@/lib/utils'
import { usePagination } from '@/hooks/use-pagination'
import type { UsePaginationReturn } from '@/hooks/use-pagination'

interface TablePaginationProps {
  showLimitSelector?: boolean
  meta?: PaginationMeta | undefined
  pageSizeOptions?: number[]
  showPageSize?: boolean
  className?: string
  pagination?: UsePaginationReturn
}

export function TablePagination({
  showLimitSelector = true,
  meta,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSize = true,
  className,
  pagination,
}: TablePaginationProps) {
  const defaultPagination = usePagination()
  const {
    page,
    limit,
    setLimit,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    getPageInfo,
  } = pagination ?? defaultPagination

  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const totalPages = meta?.totalPages || 1
    const currentPage = meta?.page || page

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 4) {
        pages.push('ellipsis')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 3) {
        pages.push('ellipsis')
      }

      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div className={cn('mt-2 flex gap-8 px-2 py-0', className)}>
      {showLimitSelector && (
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Showing</p>
            {showPageSize && (
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value ?? '0', 10))}
              >
                <SelectTrigger className="h-8 w-fit">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="text-xs font-medium text-slate-500">
            {meta ? getPageInfo(meta) : 'No data'}
          </div>
        </div>
      )}

      <Pagination className="mr-0 w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (meta && canGoPrevious(meta)) {
                  previousPage()
                }
              }}
              className={
                !meta || !canGoPrevious(meta)
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber.toString()}>
              {pageNumber === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (meta) {
                      goToPage(pageNumber)
                    }
                  }}
                  isActive={pageNumber === page}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (meta && canGoNext(meta)) {
                  nextPage()
                }
              }}
              className={
                !meta || !canGoNext(meta)
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
