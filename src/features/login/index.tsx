import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, MoveRight } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'
import { useLoginWithEmail, useSendResetPasswordEmail } from '#/api/auth'

const formSchema = z.object({
  workEmail: z.email('Enter a valid work email'),
  password: z.string().min(1, 'Password is required'),
  keepSignedIn: z.boolean(),
})

export const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workEmail: '',
      password: '',
      keepSignedIn: true,
    },
  })

  const loginMutation = useLoginWithEmail()
  const sendResetPasswordEmailMutation = useSendResetPasswordEmail()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(
      {
        email: values.workEmail,
        password: values.password,
      },
      {
        onSuccess: () => {
          navigate({ to: '/' })
        },
      },
    )
  }

  const onSendResetPasswordEmail = async (
    values: z.infer<typeof formSchema>,
  ) => {
    const isValid = await form.trigger('workEmail')
    if (!isValid) {
      toast.error('Please enter a valid work email')
      return
    }
    sendResetPasswordEmailMutation.mutate(values.workEmail)
  }

  return (
    <div className="tems-center flex justify-center px-6 py-19.5 font-manrope">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-[420px] flex-col gap-8"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-semibold text-muted-foreground">
            Welcome back
          </h1>
          <p className="max-w-90 text-sm text-muted-foreground">
            Sign in with your work email to access the CRM console.
          </p>
        </div>

        <Controller
          name="workEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Work Email</FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="john.doe@example.com"
                className="h-11"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>

              <InputGroup className="h-11">
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type={showPassword ? 'text' : 'password'}
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                />

                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex items-center justify-between gap-3">
          <Controller
            name="keepSignedIn"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation="horizontal"
                className="w-auto gap-2"
                data-invalid={fieldState.invalid}
              >
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid}
                />

                <FieldLabel
                  htmlFor={field.name}
                  className="text-base font-medium"
                >
                  Keep me signed in
                </FieldLabel>
              </Field>
            )}
          />
          <button
            type="button"
            className="text-base font-medium text-foreground underline underline-offset-2"
            onClick={() => onSendResetPasswordEmail(form.getValues())}
            disabled={sendResetPasswordEmailMutation.isPending}
          >
            {sendResetPasswordEmailMutation.isPending
              ? 'Sending...'
              : 'Forgot password?'}
          </button>
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-11"
        >
          {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
          <MoveRight data-icon="inline-end" />
        </Button>

        {loginMutation.error instanceof Error ? (
          <p className="text-sm text-destructive">
            {loginMutation.error.message}
          </p>
        ) : null}

        {sendResetPasswordEmailMutation.isSuccess ? (
          <p className="text-sm text-olive-green">
            Password reset email sent. Check your inbox for the next steps.
          </p>
        ) : null}

        {sendResetPasswordEmailMutation.error instanceof Error ? (
          <p className="text-sm text-destructive">
            {sendResetPasswordEmailMutation.error.message}
          </p>
        ) : null}

        <div className="flex flex-col items-center gap-0.5 text-center text-sm text-muted-foreground">
          <p>Access is role-gated.</p>
          <p>You’ll only see modules your account is permitted to view.</p>
        </div>
      </form>
    </div>
  )
}
