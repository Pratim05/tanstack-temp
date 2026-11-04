import { useEffect, useState } from 'react'


import { useDebouncedValue } from '#/hooks/use-debounced-value'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './ui/combobox'
import { useGetCities, useGetStates, type LocationCity } from '#/api/location-management'

function cityLabel(city: LocationCity) {
  return city.state ? `${city.city}, ${city.state}` : city.city
}

export type StateSelectorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  'aria-invalid'?: boolean
}

export function StateSelector({
  value,
  onChange,
  placeholder = 'Select state',
  disabled = false,
  className,
  id,
  'aria-invalid': ariaInvalid,
}: StateSelectorProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const {
    data: statesResponse,
    isFetching,
    isError,
  } = useGetStates({
    search: debouncedSearch.trim() || undefined,
  })

  const states = statesResponse?.data ?? []

  useEffect(() => {
    setSearch(value)
  }, [value])

  return (
    <Combobox
      items={states}
      value={value || null}
      onValueChange={(next) => {
        const selected = next ?? ''
        onChange(selected)
        setSearch(selected)
      }}
      itemToStringValue={(item) => item}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        aria-invalid={ariaInvalid}
        className={className ?? 'w-full'}
        placeholder={isError ? 'Unable to load states' : placeholder}
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          if (!event.target.value) {
            onChange('')
          }
        }}
        showClear
        disabled={disabled}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isFetching ? 'Searching states...' : 'No states found.'}
        </ComboboxEmpty>
        <ComboboxList>
          {(state) => (
            <ComboboxItem key={state} value={state}>
              {state}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export type CitySelectorProps = {
  value: string
  onChange: (cityId: string) => void
  state?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  'aria-invalid'?: boolean
}

export function CitySelector({
  value,
  onChange,
  state,
  placeholder = 'Select city',
  disabled = false,
  className,
  id,
  'aria-invalid': ariaInvalid,
}: CitySelectorProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const {
    data: citiesResponse,
    isFetching,
    isError,
  } = useGetCities({
    state: state?.trim() || undefined,
    search: debouncedSearch.trim() || undefined,
    limit: 50,
    enabled: !disabled,
  })

  const cities = citiesResponse?.data ?? []

  const selectedCity = value
    ? (cities.find((city) => city._id === value) ?? null)
    : null

  useEffect(() => {
    if (!value) {
      setSearch('')
      return
    }
    if (selectedCity) {
      setSearch(cityLabel(selectedCity))
    }
  }, [value, selectedCity])

  return (
    <Combobox
      items={cities}
      value={selectedCity}
      onValueChange={(next) => {
        if (!next) {
          onChange('')
          setSearch('')
          return
        }
        onChange(next._id)
        setSearch(cityLabel(next))
      }}
      itemToStringValue={cityLabel}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        aria-invalid={ariaInvalid}
        className={className ?? 'w-full'}
        placeholder={isError ? 'Unable to load cities' : placeholder}
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          if (!event.target.value) {
            onChange('')
          }
        }}
        showClear
        disabled={disabled}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isFetching ? 'Searching cities...' : 'No cities found.'}
        </ComboboxEmpty>
        <ComboboxList>
          {(city) => (
            <ComboboxItem key={city._id} value={city}>
              {cityLabel(city)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
