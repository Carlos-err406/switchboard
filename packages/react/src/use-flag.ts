import type { Flag, FlagPayloadType } from "@switchboard/common";
import { useEffect, useState } from "react";
import { useSwitchboardProvider } from "./provider";

export function useFlag<T extends FlagPayloadType>(
  key: string,
): Flag<T> | undefined {
  const [flag, setFlag] = useState<Flag<T>>();
  const { client } = useSwitchboardProvider();
  useEffect(() => {
    let unsubscribe = () => {};
    unsubscribe = client.on<T>(key, setFlag);
    return () => {
      unsubscribe();
    };
  }, [client, key]);
  return flag;
}
