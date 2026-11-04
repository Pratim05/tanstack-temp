import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Building, ChevronRight, LogOut } from 'lucide-react'
import { cn, formatLabel } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { Separator } from './ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from './ui/sidebar'
import { UserAvatar } from './user-avatar'
import { Button } from './ui/button'
import { useLogout } from '#/api/auth'
import { CRM_CONFIG } from '#/config/crm'


type SidebarLink = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  counterBadge?: boolean
}

type SidebarCollapsible = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: readonly {
    title: string
    url: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

type SidebarItem = SidebarLink | SidebarCollapsible

type SectionSidebarProps = {
  items: readonly SidebarItem[]
  userInfo: {
    userName: string
    userRole: string
    profilePhoto: string
  }
}

function isCollapsible(item: SidebarItem): item is SidebarCollapsible {
  return 'children' in item
}

export function SectionSidebar({ items, userInfo }: SectionSidebarProps) {
  const location = useLocation()

  const normalizePath = (path: string) => {
    if (path === '/') {
      return path
    }

    return path.replace(/\/+$/, '')
  }

  const isActive = (url: string) => {
    const currentPath = normalizePath(location.pathname)
    const targetPath = normalizePath(url)

    if (targetPath === '/') {
      return currentPath === targetPath
    }

    return (
      currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
    )
  }

  const navigate = useNavigate()

  const { mutate: logout, isPending: isLoading } = useLogout({
    onSuccess: () => {
      navigate({
        to: '/login',
        replace: true,
      })
    },
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border px-4 py-4.5 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center justify-between">
          <img
            src={CRM_CONFIG.brand.logoSrc}
            alt={CRM_CONFIG.brand.name}

            className="h-10 group-data-[collapsible=icon]:hidden w-auto"
          />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-5 pr-2 group-data-[collapsible=icon]:px-2">
        
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          menu
        </p>
        <SidebarMenu className="max-h-[94dvh] gap-1 overflow-y-auto pr-1">
          {items.map((item) =>
            isCollapsible(item) ? (
              <div key={item.title} className="flex flex-col gap-2">
                <Separator />
                <Collapsible
                  defaultOpen={item.children.some((child) =>
                    isActive(child.url),
                  )}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger>
                      <SidebarMenuButton
                        className={cn(
                          'rounded-sm p-2.5 text-sm leading-[100%] transition-all duration-300 hover:bg-input py-4',
                          'border-b-2 border-transparent transition-colors group-data-[state=open]/collapsible:border-primary',
                        )}
                      >
                        <item.icon className="size-5" />
                        {item.title}
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu className="mt-2 gap-1">
                        {item.children.map((child) => (
                          <SidebarMenuItem key={child.url}>
                            <SidebarMenuButton
                              className={cn(
                                'rounded-sm px-2.5 text-sm leading-[100%] transition-all duration-300 hover:bg-input py-4 min-h-10.5',
                                isActive(child.url)
                                  ? 'bg-primary text-white hover:text-white'
                                  : '',
                              )}
                            >
                              <Link to={child.url}>
                                {child.icon && (
                                  <child.icon className="size-5" />
                                )}
                                {child.title}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                <Separator />
              </div>
            ) : (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  className={cn(
                    'rounded-xl px-2.5 py-3 text-sm leading-[100%] transition-all duration-300 hover:bg-input font-bold min-h-10.5',
                    isActive(item.url)
                      ? 'bg-primary text-white hover:text-white hover:bg-primary/90'
                      : '',
                  )}
                >
                  <Link to={item.url} className="flex w-fit items-center gap-2">
                    <item.icon className="size-5" />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
        <SidebarFooter className="mt-auto px-0 flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <UserAvatar src={userInfo.profilePhoto} name={userInfo.userName} />
            <div>
              <p className="text-sm font-semibold">{userInfo.userName}</p>
              <span className="text-xs text-muted-foreground">
                {formatLabel(userInfo.userRole)}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => logout({})}
            disabled={isLoading}
          >
            <LogOut className="size-4" />
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
