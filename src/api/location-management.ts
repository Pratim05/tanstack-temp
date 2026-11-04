import { api } from '#/lib/api-client'
import type { ApiResponse } from '#/types'
import { useQuery } from '@tanstack/react-query'

export type LocationCity = {
  _id: string
  state: string
  city: string
  __v: number
  // regionType?: LocationRegionType;
}

export type GetCitiesParams = {
  state?: string
  search?: string
  page?: number
  limit?: number
}

export function useGetCities(params: GetCitiesParams & { enabled?: boolean }) {
  const { enabled = true, ...queryParams } = params
  return useQuery({
    queryKey: ['cities', queryParams],
    enabled,
    queryFn: () =>
      api.get<ApiResponse<LocationCity[]>>('/api/cities', {
        params: queryParams,
      }),
  })
}

export function useGetStates(params: GetCitiesParams & { enabled?: boolean }) {
  const { enabled = true, ...queryParams } = params
  return useQuery({
    queryKey: ['states', queryParams],
    enabled,
    queryFn: () =>
      api.get<ApiResponse<string[]>>('/api/cities/states', {
        params: queryParams,
      }),
  })
}
