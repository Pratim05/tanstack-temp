import { useGetUsers, useGetUserSummary } from '#/api/user-management'
import type { UserRole } from '#/api/user-management'
import { DataTable } from '#/components/data-table'
import { PageHeader } from '#/components/page-header'
import { Button } from '#/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { Search, UserPlus } from 'lucide-react'
import { createUserManagementColumns } from './column'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group'
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from '#/components/ui/select'
import { UserFormSheetWrapper } from './user-form-sheet-wrapper'
import { useMemo, useState } from 'react'
import { useDebouncedValue } from '#/hooks/use-debounced-value'
import { usePagination } from '#/hooks/use-pagination'
import { TablePagination } from '#/components/table-pagination'
import { ViewUserSheet } from './view-user-sheet'

export function UserManagement({ userRole }: { userRole: string }) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  const [isActive, setIsActive] = useState(true)
  const [role, setRole] = useState<UserRole[]>([])
  const [viewUserId, setViewUserId] = useState<string | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const canCreateUser = userRole === 'ADMIN'
  const canEditUser = userRole === 'ADMIN'
  const columns = useMemo(
    () =>
      createUserManagementColumns((userId) => {
        setViewUserId(userId)
        setViewOpen(true)
      }, canEditUser),
    [],
  )
  const { page, limit } = usePagination({
    resetKey: [search, role, isActive],
  })

  const { data: userSummary } = useGetUserSummary()
  const { data: users, isLoading: isLoadingUsers } = useGetUsers({
    search: debouncedSearch,
    role: role,
    page,
    limit,
    isActive,
  })
  const USER_ROLE_TABS = [
    {
      label: 'All users',
      value: 'all',
      count: userSummary?.data.total || 0,
    },
    ...(canCreateUser
      ? [{
          label: 'Admins',
          value: 'ADMIN',
          count: userSummary?.data.byRole.ADMIN || 0,
        }]
      : []),
    {
      label: 'Pre-sales',
      value: 'PRE_SALES',
      count: userSummary?.data.byRole.PRE_SALES || 0,
    },
    {
      label: 'Sales executives',
      value: 'SALES_EXECUTIVE',
      count: userSummary?.data.byRole.SALES_EXECUTIVE || 0,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Users & roles"
          description="Invite team members, manage roles and update account status."
        />

        {canCreateUser && (
          <UserFormSheetWrapper mode="create">
            <Button>
              <UserPlus className="w-4 h-4" />
              Create User
            </Button>
          </UserFormSheetWrapper>
        )}
      </div>
      <Tabs
        value={role.length ? role[0] : 'all'}
        onValueChange={(value) =>
          setRole(value === 'all' ? [] : [value as UserRole])
        }
      >
        <TabsList>
          {USER_ROLE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <p> {tab.label}</p> <span className=" block">{tab.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="rounded-xl bg-background p-3 grid grid-cols-2 gap-3 border">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <Select
          value={isActive ? 'ACTIVE' : 'INACTIVE'}
          onValueChange={(value) => setIsActive(value === 'ACTIVE')}
        >
          <SelectTrigger className={'w-full'}>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={users?.data || []}
        columns={columns}
        loading={isLoadingUsers}
        maxHeight={'max-h-[60vh]'}
      />
      <TablePagination meta={users?.meta.pagination} />
      <ViewUserSheet
        userId={viewUserId}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
    </div>
  )
}
