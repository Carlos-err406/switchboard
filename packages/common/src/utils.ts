import type { FlagPayloadType } from "./clients";

export const payloadType = (payload: FlagPayloadType) => {
  if (payload === undefined) return "undefined";
  if (payload === null) return "null";
  if (payload === true || payload === false) return "boolean";
  if (/^\d+$/.test(String(payload))) return "number";
  return "string";
};
