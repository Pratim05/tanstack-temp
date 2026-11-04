import { Button } from '#/components/ui/button'
import { Calendar } from '#/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { cn } from '#/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

export type DatePickerProps = {
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  displayFormat?: string
  'aria-invalid'?: boolean
}

export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  id,
  className,
  displayFormat = 'MM/dd/yyyy',
  'aria-invalid': ariaInvalid,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    defaultValue,
  )
  const [open, setOpen] = useState(false)

  const selectedDate = value ?? internalDate

  const handleSelect = (date: Date | undefined) => {
    if (value === undefined) {
      setInternalDate(date)
    }
    onChange?.(date)
    if (date) {
      setOpen(false)
    }
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
            aria-invalid={ariaInvalid}
            className={cn(
              'h-9 w-full justify-start gap-2 px-3 font-normal',
              !selectedDate && 'text-muted-foreground',
              className,
            )}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0 opacity-70" />
        {selectedDate ? format(selectedDate, displayFormat) : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          defaultMonth={selectedDate}
        />
      </PopoverContent>
    </Popover>
  )
}
