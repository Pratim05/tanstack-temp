export type PaginationMeta = {
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export type ApiMeta<TExtra extends object = object> = {
  pagination?: PaginationMeta
  summary?: Record<string, number>
} & TExtra

export type ApiResponse<TData, TMeta extends object = object> = {
  data: TData
  message: string
  success: boolean
  meta: ApiMeta<TMeta>
}
