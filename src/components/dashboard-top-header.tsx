import { Link, useLocation } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Search } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group'
import { UserAvatar } from '#/components/user-avatar'
// import { NotificationsPopover } from '#/features/notifications/notifications-popover'
import { getDashboardPageTitle } from '#/lib/dashboard-page-title'

type DashboardTopHeaderProps = {
  userName: string
  profilePhoto?: string | null
}

export function DashboardTopHeader({
  userName,
  profilePhoto,
}: DashboardTopHeaderProps) {
  const { pathname } = useLocation()
  const pageTitle = getDashboardPageTitle(pathname)
  const todayLabel = format(new Date(), 'EEE, d MMM yyyy')

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-slate-200/80 bg-[#f4f6fa] px-6 py-3 lg:flex-row lg:items-center lg:justify-between bg-background">
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-900">
              {pageTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:max-w-3xl">
        <InputGroup className="h-10 w-full rounded-full bg-white sm:max-w-md lg:flex-1 hidden">
          <InputGroupAddon>
            <Search className="size-4 text-slate-400" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search leads, phone, center…"
            className="bg-transparent"
          />
        </InputGroup>

        <div className="flex items-center justify-end gap-3">
          <span className="hidden text-sm font-medium text-slate-600 whitespace-nowrap md:inline">
            {todayLabel}
          </span>

          {/* <NotificationsPopover /> */}

          <UserAvatar
            src={profilePhoto}
            name={userName}
            className="size-10 shrink-0"
          />
        </div>
      </div>
    </header>
  )
}
