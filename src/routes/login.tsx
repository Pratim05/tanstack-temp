import { LoginForm } from '#/features/login'
import { isInternalProfile } from '#/api/auth'
import type { UserProfile } from '#/api/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import type { ApiResponse } from '#/types'
import { api } from '#/lib/api-client'
import { CRM_CONFIG } from '#/config/crm'

export function getCurrentUserProfile() {
  return api.get<ApiResponse<UserProfile>>('/api/auth/me')
}

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    try {
      const profile = await getCurrentUserProfile()

      if (isInternalProfile(profile.data)) {
        throw redirect({ to: '/' })
      }
    } catch {
      return
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="grid h-screen grid-cols-1 items-center justify-center font-manrope md:grid-cols-[1fr_2fr]">
        <div className="relative h-full px-10 py-19">
          <img
            src="/form-bg.png"
            alt="Signup"
            className="absolute inset-0 h-full w-full rounded-r-xl"
          />
          <div className="relative flex h-full flex-col items-center justify-center">
            <img
              src={CRM_CONFIG.brand.logoSrc}
              alt={CRM_CONFIG.brand.name}
              className="h-[76px] w-[255px]"
            />
            <p className="mt-5 max-w-[410px] text-center text-base">
              Welcome to the CRM. Please login to continue.
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
