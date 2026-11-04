'use client'

import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { formatBirthDateInput, parseBirthDateInput } from '@/lib/certificates'
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
        onChange={(event) => onValueChange(parseBirthDateInput(event.target.value))}
        aria-describedby={[hintId, describedBy].filter(Boolean).join(' ')}
        className={cn('h-12 appearance-none', className)}
      />
      <span id={hintId} className="sr-only max-w-px">Tag, Monat und Jahr als acht Ziffern eingeben. Die Punkte werden automatisch ergänzt.</span>
    </>
  )
}
