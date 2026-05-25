import { useConnectionState } from '@switchboard/react'
import { Badge } from '@switchboard/ui/components/badge'
import { useEffect, useRef } from 'react'

export function ConnectionStatus({
  onLog,
}: {
  onLog?: (message: string) => void
}) {
  const state = useConnectionState()
  const prevConnected = useRef<boolean | null>(null)

  useEffect(() => {
    if (!state) return
    if (state.isWebSocketConnected && prevConnected.current !== true) {
      onLog?.('connected')
    } else if (!state.isWebSocketConnected && prevConnected.current === true) {
      onLog?.('disconnected — reconnecting...')
    }
    prevConnected.current = state.isWebSocketConnected
  }, [state, onLog])

  if (!state)
    return <Badge variant="outline" className="p-1"> connecting...</Badge>
  if (state.isWebSocketConnected)
    return <Badge variant="outline" className="border-green-600 text-green-600 p-1">connected</Badge>
  if (state.hasEverConnected)
    return <Badge variant="outline" className="border-yellow-600 text-yellow-600 p-1">reconnecting ({state.connectionRetries})</Badge>
  return <Badge variant="outline" className="border-muted-foreground p-1">retrying ({state.connectionRetries})</Badge>
}
