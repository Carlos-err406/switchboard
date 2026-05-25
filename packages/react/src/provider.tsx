import { SwitchboardWsClient } from '@switchboard/js'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useRef } from 'react'

type SwitchboardContextType = {
  client: SwitchboardWsClient
}
const SwitchBoardContext = createContext<SwitchboardContextType | null>(null)

export const SwitchboardProvider: FC<
  { apiKey: string; switchboardHost: string } & PropsWithChildren
> = ({ children, apiKey, switchboardHost }) => {
  const clientRef = useRef(
    new SwitchboardWsClient({ apiKey, url: switchboardHost }),
  )
  return (
    <SwitchBoardContext.Provider value={{ client: clientRef.current }}>
      {children}
    </SwitchBoardContext.Provider>
  )
}

export const useSwitchboardProvider = () => {
  const value = useContext(SwitchBoardContext)
  if (!value)
    throw new Error(
      'useSwitchboardProvider can only be used inside <SwitchboardProvider>',
    )
  return value
}
