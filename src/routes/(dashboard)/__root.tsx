import { Outlet, createRootRoute } from '@tanstack/react-router'

import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import '#/styles.css'
import { getApiErrorToastContent } from '#/lib/api-error'
import { toast, Toaster } from 'sonner'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.meta?.suppressToast) {
        return
      }
      const { title, description } = getApiErrorToastContent(error)
      toast.error(title, description ? { description } : undefined)
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  )
}
