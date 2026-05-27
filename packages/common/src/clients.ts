/** Wraps all errors originating from Switchboard flag operations. Check `cause` for the underlying error. */

export class SwitchboardClientError extends Error {
  constructor(error: Error);
  constructor(message: string);
  constructor(messageOrError: string | Error) {
    if (messageOrError instanceof Error) {
      super(messageOrError.message, { cause: messageOrError });
    } else {
      super(messageOrError, { cause: messageOrError });
    }
    this.name = "SwitchboardClientError";
  }
}

export type SwitchboardClientOnErrorCallback = (
  error: SwitchboardClientError,
) => void;

export type FlagPayloadType = string | number | boolean | null | undefined;

export type Flag<T extends FlagPayloadType = FlagPayloadType> = {
  enabled: boolean;
  payload?: T;
};
