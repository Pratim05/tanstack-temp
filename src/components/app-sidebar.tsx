import { SectionSidebar } from '#/components/section-sidebar'
import {
  ADMIN_SIDEBAR_ROUTES,
  PRE_SALES_SIDEBAR_ROUTES,
} from '#/lib/routes'

type AppSidebarProps = {
  userInfo: {
    userName: string
    userRole: string
    profilePhoto: string
  }
}

const ROUTES_BY_ROLE = {
  ADMIN: ADMIN_SIDEBAR_ROUTES,
  PRE_SALES: PRE_SALES_SIDEBAR_ROUTES,
}

export function AppSidebar({ userInfo }: AppSidebarProps) {
  const items = ROUTES_BY_ROLE[userInfo.userRole as keyof typeof ROUTES_BY_ROLE]

  return <SectionSidebar items={items} userInfo={userInfo} />
}
