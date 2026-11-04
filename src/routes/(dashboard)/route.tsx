import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import { getCurrentUserProfile } from '../login'

import { AppSidebar } from '#/components/app-sidebar'
import { DashboardTopHeader } from '#/components/dashboard-top-header'
import { SidebarProvider } from '#/components/ui/sidebar'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/(dashboard)')({
  beforeLoad: async () => {
    let profile

    try {
      profile = await getCurrentUserProfile()
    } catch {
      throw redirect({
        to: '/login',
        replace: true,
      })
    }

    return {
      userName: `${profile.data.firstName} ${profile.data.lastName}`,
      userRole: profile.data.role,
      profilePhoto: profile.data.photoUrl ?? profile.data.profilePhoto ?? '',
    }
  },

  component: RouteComponent,
})

function RouteComponent() {
  const {
    userName = 'User',
    userRole = '',
    profilePhoto = '',
  } = Route.useRouteContext()

  return (
    <SidebarProvider>
      <AppSidebar
        userInfo={{
          userName,
          userRole,
          profilePhoto: profilePhoto || '',
        }}
      />

      <div
        className={cn(
          'relative flex min-h-svh w-full flex-col',
          'overflow-x-auto',
        )}
      >
        <DashboardTopHeader userName={userName} profilePhoto={profilePhoto} />
        <main className="relative flex-1 p-6 bg-app-background">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
