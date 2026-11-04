import { useGetUser } from '#/api/user-management'
import { Badge } from '#/components/ui/badge'
import { UserAvatar } from '#/components/user-avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { formatLabel } from '#/lib/utils'
import { format } from 'date-fns'

type ViewUserSheetProps = {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || '—'}</span>
    </div>
  )
}

export function ViewUserSheet({
  userId,
  open,
  onOpenChange,
}: ViewUserSheetProps) {
  const { data, isLoading, isError } = useGetUser(userId ?? '', {
    enabled: open && Boolean(userId),
  })
  const user = data?.data
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const city = typeof user?.city === 'string' ? user.city : user?.city?.city

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>User details</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">
            Loading user details...
          </p>
        ) : isError ? (
          <p className="p-5 text-sm text-destructive">
            Could not load user details.
          </p>
        ) : user ? (
          <div className="px-5 pb-5">
            <div className="flex items-center gap-3 border-b py-5">
              <UserAvatar
                name={name}
                src={user.profilePhoto}
                className="size-12"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{name || 'User'}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email || '—'}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  user.isActive
                    ? 'border-green-600 text-green-700'
                    : 'border-red-600 text-red-700'
                }
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <Detail label="Mobile number" value={user.mobileNumber} />
            <Detail
              label="Role"
              value={user.role ? formatLabel(user.role) : undefined}
            />
            <Detail label="City" value={city} />
            <Detail
              label="Last active"
              value={
                user.lastActiveAt
                  ? format(user.lastActiveAt, 'MMM d, yyyy hh:mm a')
                  : undefined
              }
            />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
