import * as React from 'react'
import { MapPinIcon } from 'lucide-react'
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete'
import type { PlaceSuggestion } from '@/lib/maps/autocomplete'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface LocationAutocompleteProps {
  id: string
  label: string
  placeholder: string
  value: string
  onConfirm: (description: string) => void
  disabled?: boolean
  className?: string
}

export function LocationAutocomplete({
  id,
  label,
  placeholder,
  value,
  onConfirm,
  disabled = false,
  className,
}: LocationAutocompleteProps) {
  const { query, suggestions, isOpen, handleInputChange, handleSelect, closeDropdown } =
    usePlacesAutocomplete()

  // Sync external reset (e.g. when pickup clears dropoff)
  const prevValueRef = React.useRef(value)
  React.useEffect(() => {
    if (value !== prevValueRef.current && value === '') {
      handleInputChange('')
    }
    prevValueRef.current = value
  }, [value, handleInputChange])

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleInputChange(e.target.value)
  }

  function onSelect(suggestion: PlaceSuggestion) {
    handleSelect(suggestion)
    onConfirm(suggestion.description)
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Popover open={isOpen && !disabled} onOpenChange={open => !open && closeDropdown()}>
        <PopoverAnchor asChild>
          <div className="relative">
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={id}
              placeholder={placeholder}
              value={query || value}
              onChange={onInputChange}
              disabled={disabled}
              className="pl-9"
              autoComplete="off"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {suggestions.map(suggestion => (
                  <CommandItem
                    key={suggestion.placeId}
                    value={suggestion.description}
                    onSelect={() => onSelect(suggestion)}
                  >
                    <MapPinIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{suggestion.description}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
