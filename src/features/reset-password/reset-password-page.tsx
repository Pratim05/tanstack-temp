import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { CircleCheck, CircleUser, Info, Lock, MoveRight } from 'lucide-react'
import { ResetPasswordForm } from './reset-password-form'
import { useGetResetPasswordTokenInfo } from '#/api/auth'
import type { ResetPasswordTokenInfo } from '#/api/auth'
import { format } from 'date-fns'
import { CRM_CONFIG } from '#/config/crm'

type ResetPasswordPageProps = {
  token: string
}

function formatFullName(user: ResetPasswordTokenInfo) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
}

function ResetPasswordStatus({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#EAEDFF] to-[#A7B4FF] p-4 font-manrope">
      <div className="mb-8">
        <img src={CRM_CONFIG.brand.logoSrc} alt={CRM_CONFIG.brand.name} className="h-10 w-auto" />
      </div>

      <div className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-white p-10 text-center shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-blue-50">
          <Lock className="size-6 text-blue-600" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button className="h-11 w-full">
          <Link to="/login" className="flex items-center gap-2">
            Go to Sign In
            <MoveRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const [success, setSuccess] = React.useState(false)
  const tokenInfoQuery = useGetResetPasswordTokenInfo(token)

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#EAEDFF] to-[#A7B4FF] p-4 font-manrope">
        <div className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-white p-10 shadow-sm">
          <CircleCheck className="size-12 text-green-600" />
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Password Set Successfully!
            </h1>
            <p className="text-sm text-muted-foreground">
              Your account is ready. You can now sign in with your new password.
            </p>
          </div>
          <Link to="/login">
            <Button className="h-11 w-full">
              Go to Sign In
              <MoveRight data-icon="inline-end" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <ResetPasswordStatus
        title="Invalid Reset Link"
        description="This password reset link is missing its token. Please request a new reset email and try again."
      />
    )
  }

  if (tokenInfoQuery.isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#EAEDFF] to-[#A7B4FF] p-4 font-manrope">
        <div className="mb-8">
          <img
            src={CRM_CONFIG.brand.logoSrc}
            alt={CRM_CONFIG.brand.name}
            className="h-[76px] w-[255px]"
          />
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl bg-white p-10 shadow-sm">
          {/* Heading area: lock icon + title + subtitle */}
          <div className="flex flex-col items-center gap-3 text-center">
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="h-7 w-44" />
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>

          {/* User info card */}
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3.5">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>

          {/* Form area: label + input, requirements box, button */}
          <div className="flex flex-col gap-5">
            {/* Field: label + input */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-11 w-full" />
            </div>

            {/* Password requirements box */}
            <div className="rounded-lg bg-muted/50 p-4">
              <Skeleton className="mb-3 h-4 w-40" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="size-4 shrink-0 rounded-full" />
                    <Skeleton className="h-3 w-full max-w-44" />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (tokenInfoQuery.error instanceof Error || !tokenInfoQuery.data) {
    return (
      <ResetPasswordStatus
        title="Reset Link Unavailable"
        description={
          tokenInfoQuery.error instanceof Error
            ? tokenInfoQuery.error.message
            : 'This password reset link is invalid or has expired. Please request a new one.'
        }
      />
    )
  }

  const fullName = formatFullName(tokenInfoQuery.data.data) || 'User'
  const formattedExpiry = format(
    tokenInfoQuery.data.data.tokenExpiry,
    'yyyy-MM-dd HH:mm:ss',
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#EAEDFF] to-[#A7B4FF] p-4 font-manrope">
      <div className="mb-8">
        <img
          src={CRM_CONFIG.brand.logoSrc}
          alt={CRM_CONFIG.brand.name}
          className="h-10 w-auto"
        />
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-blue-50">
            <Lock className="size-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Set Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome to the CRM!
            <br />
            Create a secure password to complete your account setup.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <CircleUser className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {fullName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {tokenInfoQuery.data.data.role}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Expires {formattedExpiry}
            </p>
          </div>
        </div>

        <ResetPasswordForm token={token} onSuccess={() => setSuccess(true)} />
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-center text-xs text-muted-foreground">
        <Info className="size-3.5 shrink-0" />
        If you didn&apos;t request this, you can safely ignore this or{' '}
        <button type="button" className="underline underline-offset-2">
          contact support
        </button>
        .
      </p>
    </div>
  )
}
