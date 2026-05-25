import type { FlagValueType } from '@switchboard/common'
import { useEffect, useState } from 'react'
import { useSwitchboardProvider } from './provider'

export function useFlag<T extends FlagValueType>(
  flag: string,
  defaultValue?: T,
) {
  const [value, setValue] = useState<T>()
  const { client } = useSwitchboardProvider()
  useEffect(() => {
    let unsubscribe = () => {}
    if (defaultValue !== undefined) {
      unsubscribe = client.on<T>(flag, setValue, defaultValue)
    } else {
      unsubscribe = client.on<T>(flag, setValue)
    }
    return () => {
      unsubscribe()
    }
  }, [client, flag])
  return value
}
