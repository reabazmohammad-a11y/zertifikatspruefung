'use client'

import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { formatBirthDateInput, maskBirthDateInput, parseBirthDateInput } from '@/lib/certificates'
import { cn } from '@/lib/utils'

type Props = Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'type' | 'inputMode'> & {
  id: string
  value: string
  onValueChange: (value: string) => void
}

export function BirthDateInput({ id, value, onValueChange, className, 'aria-describedby': describedBy, ...props }: Props) {
  const hintId = `${id}-format`

  return (
    <>
      <Input
        {...props}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="TT.MM.JJJJ"
        maxLength={10}
        spellCheck={false}
        value={formatBirthDateInput(value)}
        onChange={(event) => {
          const input = event.currentTarget
          const masked = maskBirthDateInput(input.value, value, input.selectionStart ?? input.value.length, (event.nativeEvent as InputEvent).inputType ?? '')
          input.value = masked.formatted
          input.setSelectionRange(masked.cursor, masked.cursor)
          onValueChange(parseBirthDateInput(masked.formatted))
        }}
        aria-describedby={[hintId, describedBy].filter(Boolean).join(' ')}
        className={cn('h-12 appearance-none', className)}
      />
      <span id={hintId} className="sr-only max-w-px">Tag, Monat und Jahr als acht Ziffern eingeben. Die Punkte werden automatisch ergänzt.</span>
    </>
  )
}
