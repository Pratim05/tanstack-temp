import * as React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useCreateUser, useUpdateUser, USER_ROLES } from '#/api/user-management'
import type { UserMainListItem, UserRole } from '#/api/user-management'
import { RequiredLabel } from '#/components/required-label'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '#/components/ui/input-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { formatLabel } from '#/lib/utils'

const userRoleValues = USER_ROLES.map((role) => role.value) as [
  UserRole,
  ...UserRole[],
]

const userFormSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().optional(),
    email: z.string().trim().email('Enter a valid email address'),
    mobileNumber: z.string().trim().min(1, 'Mobile number is required'),
    role: z.enum(userRoleValues),
    password: z.string().optional(),
    active: z.boolean().optional(),
  })

export type UserFormValues = z.infer<typeof userFormSchema>

type UserFormSheetWrapperProps = {
  children: React.ReactNode
  mode?: 'create' | 'edit'
  userDetails?: UserMainListItem
}

function getDefaultValues(
  mode: 'create' | 'edit',
  userDetails?: UserMainListItem,
): UserFormValues {
  if (mode === 'create' || !userDetails) {
    return {
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      role: 'ADMIN',
      active: true,
    }
  }

  return {
    password: '',
    firstName: userDetails.firstName ?? '',
    lastName: userDetails.lastName ?? '',
    email: userDetails.email ?? '',
    mobileNumber: userDetails.mobileNumber ?? '',
    role: userDetails.role ?? 'ADMIN',
    active: userDetails.isActive ?? true,
  }
}

export function UserFormSheetWrapper({
  children,
  mode = 'create',
  userDetails,
}: UserFormSheetWrapperProps) {
  const isEdit = mode === 'edit'
  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
  const isPending = isCreating || isUpdating

  const [open, setOpen] = React.useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: getDefaultValues(mode, userDetails),
    mode: 'onChange',
  })

  React.useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(mode, userDetails))
    }
  }, [open, mode, userDetails, form])

  const handleSubmit = (values: UserFormValues) => {
    if (isEdit) {
      if (!userDetails) return

      updateUser(
        {
          userId: userDetails._id,
          isActive: values.active ?? true,
        },
        {
          onSuccess: () => {
            toast.success('User updated successfully')
            setOpen(false)
          },
        },
      )
      return
    }

    const password = values.password?.trim() ?? ''
    if (password.length < 6) {
      form.setError('password', {
        message: 'Password must be at least 6 characters long',
      })
      return
    }

    createUser(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() ?? '',
        email: values.email.trim(),
        mobileNumber: values.mobileNumber.trim(),
        password,
        role: values.role,
      },
      {
        onSuccess: () => {
          toast.success('User created successfully')
          setOpen(false)
          form.reset(getDefaultValues('create'))
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : 'Failed to create user',
          )
        },
      },
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children as React.ReactElement}>
        {null}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-xl"
      >
        <SheetHeader className="shrink-0 border-b px-6 py-5 pr-16 text-left">
          <SheetTitle className="text-xl">
            {isEdit ? 'Edit user' : 'Create user'}
          </SheetTitle>
          <SheetDescription>
            {isEdit
            ? 'Update the user account status.'
              : "They'll get an email and SMS invite to set a password."}
          </SheetDescription>
        </SheetHeader>

        <form
          id="user-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                1 · Person
              </h3>

              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <RequiredLabel>First name</RequiredLabel>
                        <Input
                          {...field}
                          id="firstName"
                          placeholder="e.g. Moumita"
                          disabled={isEdit}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />

                  <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Last name</FieldLabel>
                        <Input
                          {...field}
                          id="lastName"
                          placeholder="e.g. Paul"
                          disabled={isEdit}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <RequiredLabel>Email</RequiredLabel>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          disabled={isEdit}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />

                  {!isEdit && (
                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <RequiredLabel>Password</RequiredLabel>
                          <InputGroup className="h-11">
                            <InputGroupInput
                              {...field}
                              id={field.name}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              className="h-11"
                              aria-invalid={fieldState.invalid}
                              autoComplete="new-password"
                            />
                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                type="button"
                                size="icon-xs"
                                aria-label={
                                  showPassword
                                    ? 'Hide password'
                                    : 'Show password'
                                }
                                onClick={() =>
                                  setShowPassword((previous) => !previous)
                                }
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </InputGroupButton>
                            </InputGroupAddon>
                          </InputGroup>
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  )}

                  <Controller
                    name="mobileNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <RequiredLabel>Mobile number</RequiredLabel>
                        <Input
                          {...field}
                          id="mobileNumber"
                          type="tel"
                          placeholder="+91 98XXX XXXXX"
                          disabled={isEdit}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                2 · Role
              </h3>

              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {USER_ROLES.map((role) => {
                        const selected = field.value === role.value

                        return (
                          <button
                            key={role.value}
                            type="button"
                            disabled={isEdit}
                            onClick={() => field.onChange(role.value)}
                            aria-pressed={selected}
                            className={[
                              'flex min-h-20 items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                              isEdit ? 'cursor-default opacity-60' : '',
                              selected
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-input hover:bg-muted/50',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                'mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border',
                                selected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/60',
                              ].join(' ')}
                            >
                              {selected && (
                                <span className="size-2 rounded-full bg-white" />
                              )}
                            </span>

                            <span className="min-w-0 space-y-1">
                              <span className="block text-sm font-semibold">
                                {formatLabel(role.value)}
                              </span>
                              <span className="block text-xs leading-relaxed text-muted-foreground">
                                {role.description}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </section>

            {isEdit && (
              <section className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  3 · Status
                </h3>
                <Controller
                  name="active"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[20px_1fr]"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id="active"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        aria-invalid={fieldState.invalid}
                        className="size-4"
                      />
                      <FieldLabel htmlFor="active">Active</FieldLabel>
                    </Field>
                  )}
                />
              </section>
            )}
          </div>

          <SheetFooter className="shrink-0 flex-row justify-end gap-2 border-t px-6 py-4">
            <SheetClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />

            <Button type="submit" form="user-form" disabled={isPending}>
              {isPending
                ? 'Saving...'
                : isEdit
                  ? 'Save changes'
                  : 'Create & send invite'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
