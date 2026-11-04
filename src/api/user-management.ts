import { api } from '#/lib/api-client'
import { queryClient } from '#/routes/__root'
import type { ApiResponse } from '#/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const USER_ROLES = [
  {
    value: 'ADMIN',
    description: 'Manage users, roles and reports',
  },
  {
    value: 'PRE_SALES',
    description: 'Pre-sales support and customer inquiries',
  },
  {
    value: 'SALES_EXECUTIVE',
    description: 'Sales team member',
  },
]
export type UserRole = (typeof USER_ROLES)[number]['value']

export type InviteUserPayload = {
  email: string
  mobileNumber: string
  firstName: string
  lastName: string
  role: UserRole
  password: string
}

export type UserMainListItem = {
  _id: string
  profilePhoto?: string | null
  role?: string | null
  mobileNumber?: string | null
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  isActive?: boolean
  isDeleted?: boolean
  lastActiveAt?: string | null
  city?:
    | { city: string; state: string; regionType: string; _id: string }
    | string
    | null
}

export type UserDetails = UserMainListItem & {}
export type UpdateUserPayload = { isActive?: boolean }

export function useCreateUser() {
  return useMutation({
    mutationFn: (payload: InviteUserPayload) =>
      api.post<ApiResponse<undefined>>('/api/users', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user-summary'] })
    },
  })
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({
      userId,
      ...payload
    }: UpdateUserPayload & { userId: string }) =>
      api.patch<ApiResponse<undefined>>(`/api/users/${userId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user-summary'] })
    },
  })
}

export type GetUsersParams = {
  page?: number
  limit?: number
  search?: string
  role?: UserRole[]
  isActive?: boolean
}

export function useGetUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => {
      const { role, ...rest } = params ?? {}

      return api.get<ApiResponse<UserMainListItem[]>>('/api/users', {
        params: {
          ...rest,
          role: role?.length ? role.join(',') : undefined,
        },
      })
    },
  })
}
export function useGetUser(userId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['users', userId],
    enabled: options?.enabled ?? Boolean(userId),
    queryFn: () =>
      api.get<ApiResponse<UserDetails>>(`/api/users/${userId}`, {}),
  })
}

export type UserSummary = {
  total: number
  active: number
  inactive: number
  byRole: Record<UserRole, number>
}
export function useGetUserSummary() {
  return useQuery({
    queryKey: ['user-summary'],
    queryFn: () => api.get<ApiResponse<UserSummary>>('/api/users/summary'),
  })
}

export function deactivateUser(userId: string) {
  return useMutation({
    mutationFn: () =>
      api.patch<ApiResponse<undefined>>(`/api/user/${userId}/deactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
