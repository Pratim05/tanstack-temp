import { ResetPasswordPage } from '@/features/reset-password/reset-password-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search): { token: string } => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  return <ResetPasswordPage token={token} />
}
