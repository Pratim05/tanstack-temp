import { Button } from '#/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { cn } from '#/lib/utils'
import { format } from 'date-fns'
import { Clock } from 'lucide-react'
import { useMemo, useState } from 'react'

function buildTimeSlots(intervalMinutes = 30) {
  const slots: string[] = []

  for (let hour = 9; hour <= 20; hour += 1) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === 20 && minute > 0) {
        break
      }
      slots.push(format(new Date(2026, 0, 1, hour, minute), 'h:mm a'))
    }
  }

  return slots
}

export type TimePickerProps = {
  value?: string
  defaultValue?: string
  onChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  intervalMinutes?: number
}

export function TimePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'Select time',
  disabled = false,
  id,
  className,
  intervalMinutes = 30,
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)

  const selectedTime = value ?? internalValue
  const timeSlots = useMemo(
    () => buildTimeSlots(intervalMinutes),
    [intervalMinutes],
  )

  const handleSelect = (time: string) => {
    if (value === undefined) {
      setInternalValue(time)
    }
    onChange?.(time)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'h-9 w-full justify-start gap-2 px-3 font-normal',
              !selectedTime && 'text-muted-foreground',
              className,
            )}
          />
        }
      >
        <Clock className="size-4 shrink-0 opacity-70" />
        {selectedTime ?? placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-[var(--anchor-width)] p-1" align="start">
        <ul className="max-h-56 overflow-y-auto">
          {timeSlots.map((time) => (
            <li key={time}>
              <Button
                type="button"
                variant={selectedTime === time ? 'secondary' : 'ghost'}
                className="h-9 w-full justify-start rounded-md px-2 font-normal"
                onClick={() => handleSelect(time)}
              >
                {time}
              </Button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
