import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { format, formatDistanceToNow } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  limit = 4000,
) {
  let inThrottle = false

  return (...args: T) => {
    if (inThrottle) return

    inThrottle = true
    fn(...args)
    setTimeout(() => {
      inThrottle = false
    }, limit)
  }
}
export function formatCurrency(value: number) {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export const getNameInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
export const formatLabel = (name: string) => {
  if (!name) return ''
  return name.replaceAll('_', ' ')
}

export function formatLeadActivityRelative(iso: string) {
  return formatDistanceToNow(new Date(iso), { addSuffix: true })
}

export function formatLeadActivityTimestamp(iso: string) {
  return format(new Date(iso), 'dd MMM yyyy, h:mm a')
}

export function formatToLakh(amount: number, decimals = 2): string {
  if (!Number.isFinite(amount)) return '₹0'

  if (Math.abs(amount) < 100000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return `₹${(amount / 100000).toFixed(decimals)} L`
}



export const PREFERRED_LANGUAGES = [
  'ENGLISH',
  'HINDI',
  'ASSAMESE',
  'BENGALI',
  'BODO',
  'DOGRI',
  'GUJARATI',
  'KANNADA',
  'KASHMIRI',
  'KONKANI',
  'MAITHILI',
  'MALAYALAM',
  'MANIPURI',
  'MARATHI',
  'NEPALI',
  'ODIA',
  'PUNJABI',
  'SANSKRIT',
  'SANTALI',
  'SINDHI',
  'TAMIL',
  'TELUGU',
  'URDU',
] as const

export const REGION_OPTIONS = [
  'Southern',
  'Western',
  'Northern',
  'Eastern',
] as const

type ParamValue = string | number | boolean | null | undefined | string[]

export const formatParams = (
  params: Record<string, ParamValue>,
): Record<string, string | number | boolean | null | undefined> => {
  return Object.fromEntries(
    Object.entries(params)
      .filter(
        ([, value]) =>
          value !== undefined && value !== null && `${value}` !== '',
      )
      .map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : value,
      ]),
  )
}
