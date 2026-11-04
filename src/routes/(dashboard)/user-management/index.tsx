import { UserManagement } from '#/features/user-management'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/user-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userRole } = Route.useRouteContext()

  return <UserManagement userRole={userRole} />
}
