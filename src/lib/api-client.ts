import { API_URL } from '@/config/env'

import { ApiError } from '#/lib/api-error'
import type { ApiValidationErrors } from '#/lib/api-error'

type ApiErrorBody = {
  message?: string
  errors?: ApiValidationErrors
}

async function readApiErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    return (await response.json()) as ApiErrorBody
  } catch {
    return {}
  }
}

type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, string | number | boolean | undefined | null>
}

function buildUrlWithParams(
  url: string,
  params?: RequestOptions['params'],
): string {
  if (!params) return url
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  )
  if (Object.keys(filteredParams).length === 0) return url
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>,
  ).toString()
  return `${url}?${queryString}`
}

async function fetchApi<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { headers, method = 'GET', body, params } = options

  const fullUrl = buildUrlWithParams(`${API_URL}${url}`, params)

  const isFormData = body instanceof FormData

  const response = await fetch(fullUrl, {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Accept: 'application/json',
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })

  if (!response.ok) {
    const body = await readApiErrorBody(response)
    throw new ApiError(body.message || response.statusText, body.errors)
  }

  return response.json()
}

export type DownloadedFile = {
  blob: Blob
  filename?: string
}

export async function downloadFile(
  path: string,
  options?: {
    params?: RequestOptions['params']
    fallbackFilename?: string
  },
): Promise<DownloadedFile> {
  const params = options?.params
    ? Object.fromEntries(
        Object.entries(options.params).filter(
          ([, value]) =>
            value !== undefined && value !== null && `${value}` !== '',
        ),
      )
    : undefined

  const response = await fetch(
    buildUrlWithParams(`${API_URL}${path}`, params),
    {
      method: 'GET',
      credentials: 'include',
    },
  )

  if (!response.ok) {
    const body = await readApiErrorBody(response)
    throw new ApiError(body.message || response.statusText, body.errors)
  }

  const disposition = response.headers.get('Content-Disposition') ?? ''
  const rawName =
    disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1] ??
    disposition.match(/filename="?([^"]+)"?/i)?.[1]

  return {
    blob: await response.blob(),
    filename: rawName ? decodeURIComponent(rawName) : options?.fallbackFilename,
  }
}

export function saveDownloadedFile({ blob, filename }: DownloadedFile) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  if (filename) {
    anchor.download = filename
  }
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'GET' })
  },
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'POST', body })
  },
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'PUT', body })
  },
  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'PATCH', body })
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'DELETE' })
  },
}
