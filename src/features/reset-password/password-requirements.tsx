import { cn } from '@/lib/utils'
import { Circle, CircleCheck } from 'lucide-react'

const requirements = [
  { label: 'At least 8 characters long', test: (pw: string) => pw.length >= 8 },
  { label: 'Contains number (0-9)', test: (pw: string) => /[0-9]/.test(pw) },
  {
    label: 'Contains uppercase letter (A-Z)',
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: 'Contains special character (!@#$%^&*)',
    test: (pw: string) => /[!@#$%^&*]/.test(pw),
  },
  {
    label: 'Contains lowercase letter (a-z)',
    test: (pw: string) => /[a-z]/.test(pw),
  },
] as const

type PasswordRequirementsProps = {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <p className="mb-3 text-sm font-semibold">Password Requirements:</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {requirements.map((req) => {
          const met = password.length > 0 && req.test(password)
          return (
            <div key={req.label} className="flex items-center gap-2 text-xs">
              {met ? (
                <CircleCheck className="size-4 shrink-0 text-green-600" />
              ) : (
                <Circle
                  className={cn(
                    'size-4 shrink-0',
                    password.length > 0
                      ? 'text-muted-foreground/40'
                      : 'text-muted-foreground/30',
                  )}
                />
              )}
              <span
                className={cn(
                  'text-muted-foreground',
                  met && 'text-foreground',
                )}
              >
                {req.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
