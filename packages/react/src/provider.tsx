import type { SwitchboardClientMode } from "@switchboard/js";
import { SwitchboardClient } from "@switchboard/js";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useRef } from "react";

type SwitchboardContextType = {
  client: SwitchboardClient;
};
const SwitchBoardContext = createContext<SwitchboardContextType | null>(null);

export const SwitchboardProvider: FC<
  {
    apiKey: string;
    switchboardHost: string;
    /**
     * Transport mode.
     * - `"realtime"` — persistent WebSocket, instant flag updates (default)
     * - `"poll"` — periodic HTTP fetches, no persistent connection
     * @default "realtime"
     */
    mode?: SwitchboardClientMode;
    /**
     * Polling interval in milliseconds. Only used when `mode` is `"poll"`.
     * @default 30000
     */
    pollInterval?: number;
  } & PropsWithChildren
> = ({ children, apiKey, switchboardHost, mode, pollInterval }) => {
  const clientRef = useRef(
    new SwitchboardClient({
      apiKey,
      url: switchboardHost,
      mode,
      pollInterval,
    }),
  );
  return (
    <SwitchBoardContext.Provider value={{ client: clientRef.current }}>
      {children}
    </SwitchBoardContext.Provider>
  );
};

export const useSwitchboardProvider = () => {
  const value = useContext(SwitchBoardContext);
  if (!value)
    throw new Error(
      "useSwitchboardProvider can only be used inside <SwitchboardProvider>",
    );
  return value;
};
