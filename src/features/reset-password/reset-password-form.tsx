import * as React from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, MoveRight } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'


import { PasswordRequirements } from './password-requirements'
import { useResetPasswordWithToken } from '#/api/auth'
import { RequiredLabel } from '#/components/required-label'

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'At least 8 characters long')
    .regex(/[A-Z]/, 'Contains uppercase letter (A-Z)')
    .regex(/[a-z]/, 'Contains lowercase letter (a-z)')
    .regex(/[0-9]/, 'Contains number (0-9)')
    .regex(/[!@#$%^&*]/, 'Contains special character (!@#$%^&*)'),
})

type PasswordFormValues = z.infer<typeof passwordSchema>

type ResetPasswordFormProps = {
  token: string
  onSuccess: () => void
}

export function ResetPasswordForm({
  token,
  onSuccess,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  })

  const watchedPassword = useWatch({
    control: form.control,
    name: 'password',
  })

  const resetPasswordMutation = useResetPasswordWithToken()

  const onSubmit = (values: PasswordFormValues) => {
    resetPasswordMutation.mutate(
      {
        token,
        password: values.password,
      },
      {
        onSuccess,
      },
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                <RequiredLabel>Create Password</RequiredLabel>
              </FieldLabel>

              <InputGroup className="h-11">
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Your Password"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                />

                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((previous) => !previous)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <PasswordRequirements password={watchedPassword} />

      {resetPasswordMutation.error instanceof Error && (
        <p role="alert" className="text-sm text-destructive">
          {resetPasswordMutation.error.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={resetPasswordMutation.isPending || !form.formState.isValid}
        className="h-11 bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500"
      >
        {resetPasswordMutation.isPending
          ? 'Setting Password...'
          : 'Set Password & Continue'}

        <MoveRight data-icon="inline-end" />
      </Button>
    </form>
  )
}
