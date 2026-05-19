import { CalendarIcon } from 'lucide-react'
import React, { useEffect, useState, type FC } from 'react'

import { Calendar } from './calendar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './input-group'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

function formatDate(date: Date | undefined) {
  if (!date) return ''

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

export type DatePickerInputProps = Omit<
  React.ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange'
> & {
  value?: number | null
  defaultValue?: number | null
  onChange?: (value: number | null) => void
  onDateChange?: (date: Date | undefined) => void
}

export const DatePickerInput: FC<DatePickerInputProps> = ({
  value: valueProp,
  defaultValue,
  onChange,
  onDateChange,
  onKeyDown,
  ...props
}) => {
  const [open, setOpen] = useState(false)

  const isControlled = valueProp !== undefined

  const [internalValue, setInternalValue] = useState<number | null>(
    defaultValue ?? null,
  )

  const value = isControlled ? valueProp : internalValue

  const dateFromValue = (value: number | null | undefined) => {
    if (value == null) return undefined

    const parsed = new Date(value)

    return isValidDate(parsed) ? parsed : undefined
  }

  const [date, setDate] = useState<Date | undefined>(() => dateFromValue(value))

  const [month, setMonth] = useState<Date | undefined>(date)

  const displayValue = formatDate(dateFromValue(value))

  useEffect(() => {
    const nextDate = dateFromValue(value)

    setDate(nextDate)

    if (nextDate) {
      setMonth(nextDate)
    }
  }, [value])

  const updateValue = (nextValue: string) => {
    const parsed = new Date(nextValue)

    if (isValidDate(parsed)) {
      const timestamp = parsed.getTime()

      if (!isControlled) {
        setInternalValue(timestamp)
      }

      setDate(parsed)
      setMonth(parsed)
      onChange?.(timestamp)
      onDateChange?.(parsed)

      return
    }

    if (!isControlled) {
      setInternalValue(null)
    }

    setDate(undefined)
    onChange?.(null)
    onDateChange?.(undefined)
  }

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        value={displayValue}
        onChange={(e) => {
          updateValue(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }

          onKeyDown?.(e)
        }}
      />

      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
            >
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={(nextDate) => {
                if (!nextDate) {
                  if (!isControlled) {
                    setInternalValue(null)
                  }

                  setDate(undefined)
                  onChange?.(null)
                  onDateChange?.(undefined)
                  return
                }

                const timestamp = nextDate.getTime()

                if (!isControlled) {
                  setInternalValue(timestamp)
                }

                setDate(nextDate)
                setMonth(nextDate)
                onChange?.(timestamp)
                onDateChange?.(nextDate)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}
