import type { ConnectionState } from "convex/browser";
import { useEffect, useState } from "react";
import { useSwitchboardProvider } from "./provider";

export function useConnectionState(): ConnectionState | null {
  const { client } = useSwitchboardProvider();
  const [state, setState] = useState<ConnectionState | null>(null);
  useEffect(() => {
    return client.onConnectionChange(setState);
  }, [client]);
  return state;
}
