import { useNavigate, useSearch } from '@tanstack/react-router'
import type { FC } from 'react'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '#/components/ui/input'

export const SearchInput: FC = () => {
  const search = useSearch({ from: '__root__' })
  const [value, setValue] = useState(search.q ?? '')
  const navigate = useNavigate()

  const debounced = useDebouncedCallback(
    // function
    (dValue) => {
      navigate({
        to: '.',
        search: { q: dValue || undefined },
      })
    },
    // delay in ms
    1000,
  )

  return (
    <Input
      type="search"
      placeholder="search..."
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debounced(e.target.value)
      }}
    />
  )
}
