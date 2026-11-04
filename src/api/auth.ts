import { api } from '#/lib/api-client'
import type { ApiResponse } from '#/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import { queryClient } from '#/routes/__root'
import { USER_ROLES, type UserRole } from './user-management'
import { queryKeys } from './query-keys'

export const isInternalProfile = (profile: UserProfile) => {
  return USER_ROLES.some((role) => role.value === profile.role)
}

export type UserProfile = {
  _id: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  role: UserRole
  designation?: string
  photoUrl?: string | null
  profilePhoto?: string | null
  center?: {
    _id: string
    name: string
    code: string
    city: string
    state: string
    isActive: boolean
  }
  isActive: boolean
  lastActiveAt: string
  permissions: string[]
}

export type UpdateUserProfilePayload = {
  firstName?: string
  lastName?: string
  email?: string
  mobileNumber?: string
  // mobile?: string;
  employeeId?: string
  address?: string
  photoUrl?: string
  cityId?: string
  areaIds?: string[]
  designation?: string
}

export function useGetCurrentUserProfile() {
  return useQuery({
    queryKey: queryKeys.userProfile.all(),
    queryFn: () => api.get<ApiResponse<UserProfile>>('/api/auth/me'),
  })
}

export function useUpdateCurrentUserProfile() {
  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      api.patch<ApiResponse<UserProfile>>('/api/auth/me', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile.all() })
    },
  })
}

export type ChangePasswordPayload = {
  currentPassword: string
  password: string
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      api.patch<ApiResponse<undefined>>('/api/auth/change-password', payload),
  })
}

export type ResetPasswordTokenInfo = {
  firstName: string
  lastName: string
  role: string
  tokenExpiry: string
}

export type ResetPasswordWithTokenPayload = {
  token: string
  password: string
}
export function useGetResetPasswordTokenInfo(token: string) {
  return useQuery({
    queryKey: ['reset-password-token-info', token],
    queryFn: () =>
      api.get<ApiResponse<ResetPasswordTokenInfo>>('/api/auth/token', {
        params: { token },
      }),
  })
}

export function useSendResetPasswordEmail() {
  return useMutation({
    mutationFn: (email: string) =>
      api.post<ApiResponse<undefined>>('/api/auth/forgot-password', { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile.all() })
    },
  })
}
export function useResetPasswordWithToken() {
  return useMutation({
    mutationFn: (payload: ResetPasswordWithTokenPayload) =>
      api.post<ApiResponse<undefined>>('/api/auth/reset-password', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile.all() })
    },
  })
}

export function useLogout(
  options?: UseMutationOptions<
    ApiResponse<undefined>,
    Error,
    Record<string, never>
  >,
) {
  return useMutation({
    mutationFn: () => api.post<ApiResponse<undefined>>('/api/auth/logout', {}),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userProfile.all(),
      })

      options?.onSuccess?.(...args)
    },
    ...options,
  })
}
export function useDeleteUserProfile() {
  return useMutation({
    mutationFn: () =>
      api.delete<ApiResponse<undefined>>('/api/user/account', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile.all() })
    },
  })
}

export type LoginWithEmailPayload = {
  email: string
  password: string
}
export function useLoginWithEmail() {
  return useMutation({
    mutationFn: (payload: LoginWithEmailPayload) =>
      api.post<ApiResponse<undefined>>('/api/auth/login', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile.all() })
    },
  })
}
