import type { UserMainListItem } from '#/api/user-management'
import type { dataTableFeatures } from '#/components/data-table'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { UserAvatar } from '#/components/user-avatar'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Eye, Pen } from 'lucide-react'
import { UserFormSheetWrapper } from './user-form-sheet-wrapper'
import { cn, formatLabel } from '#/lib/utils'
import { format } from 'date-fns'

export const createUserManagementColumns = (
  onViewUser: (userId: string) => void,
  canEditUser: boolean,
): ColumnDef<typeof dataTableFeatures, UserMainListItem>[] => {
  return [
    {
      header: 'FULL NAME',
      accessorKey: 'firstName',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <UserAvatar
              name={`${row.original.firstName} ${row.original.lastName}`}
              src={row.original.profilePhoto}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{`${row.original.firstName} ${row.original.lastName}`}</p>
              <p className="text-xs text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      header: 'MOBILE NUMBER',
      accessorKey: 'mobileNumber',
    },
    {
      header: 'ROLE',
      accessorKey: 'role',
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="font-semibold border-primary">
            {row.original.role ? formatLabel(row.original.role) : '-'}
          </Badge>
        )
      },
    },
    {
      header: 'STATUS',
      accessorKey: 'isActive',
      cell: ({ row }) => {
        return (
          <Badge
            className={cn(
              'text-white',
              row.original.isActive ? 'bg-green-500' : 'bg-red-500',
            )}
            variant="outline"
          >
            {row.original.isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    {
      header: 'LAST ACTIVE',
      accessorKey: 'lastActiveAt',
      cell: ({ row }) => {
        return (
          <p className="text-xs text-muted-foreground0">
            {row.original.lastActiveAt
              ? format(
                  new Date(row.original.lastActiveAt),
                  'dd MMM yyyy hh:mm a',
                )
              : '-'}
          </p>
        )
      },
    },
    {
      header: 'ACTIONS',
      accessorKey: 'actions',
      cell: ({ row }) => {
        return (
          <ActionCell
            row={row}
            onViewUser={onViewUser}
            canEditUser={canEditUser}
          />
        )
      },
    },
  ]
}
const ActionCell = ({
  row,
  onViewUser,
  canEditUser,
}: {
  row: Row<typeof dataTableFeatures, UserMainListItem>
  onViewUser: (userId: string) => void
  canEditUser: boolean
}) => {
  // const { mutate: deactivateUserMutation, isPending: isDeactivatePending } =
  //   deactivateUser(row.original._id)
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`View ${row.original.firstName ?? 'user'}`}
        onClick={() => onViewUser(row.original._id)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      {canEditUser && (
        <UserFormSheetWrapper mode="edit" userDetails={row.original}>
          <Button variant="ghost" size="icon">
            <Pen className="w-4 h-4" />
          </Button>
        </UserFormSheetWrapper>
      )}
      {/* <Button
        variant="outline"
        size="lg"
        className="border-destructive text-destructive"
        onClick={() => deactivateUserMutation()}
        disabled={isDeactivatePending}
      >
        {isDeactivatePending ? 'Deactivating...' : 'Deactivate'}
      </Button> */}
    </div>
  )
}
