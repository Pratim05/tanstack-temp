export type ApiValidationErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly errors?: ApiValidationErrors

  constructor(message: string, errors?: ApiValidationErrors) {
    super(message)
    this.name = 'ApiError'
    this.errors = errors
  }
}

export function formatValidationErrors(errors: ApiValidationErrors): string {
  return Object.entries(errors)
    .flatMap(([field, messages]) =>
      messages.map((message) => `${field}: ${message}`),
    )
    .join('\n')
}

export function getApiErrorToastContent(error: unknown): {
  title: string
  description?: string
} {
  if (error instanceof ApiError && error.errors) {
    return {
      title: error.message,
      description: formatValidationErrors(error.errors),
    }
  }

  if (error instanceof Error) {
    return { title: error.message }
  }

  return { title: 'Something went wrong' }
}
