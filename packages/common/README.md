# @switchboard/common

Shared types and helpers used across the [Switchboard](https://github.com/Carlos-err406/switchboard) SDKs ([`@switchboard/js`](../js), [`@switchboard/react`](../react), [`@switchboard/edge`](../edge)). You normally consume these transitively, but the types are useful when writing your own wrappers.

## Install

```sh
npm install @switchboard/common
```

## Types

### `Flag<T>`

The shape every SDK returns for a flag.

```ts
type FlagPayloadType = string | number | boolean | null | undefined;

type Flag<T extends FlagPayloadType = FlagPayloadType> = {
  enabled: boolean;
  payload?: T;
};
```

### `SwitchboardClientError`

Wraps every error originating from a flag operation. The underlying error is available on `.cause`.

```ts
import { SwitchboardClientError } from "@switchboard/common";

try {
  await client.getFlag("new-checkout");
} catch (e) {
  if (e instanceof SwitchboardClientError) {
    console.error(e.message, e.cause);
  }
}
```

`SwitchboardClientOnErrorCallback` is the `(error: SwitchboardClientError) => void` signature used by the SDKs' `onError` options.

## Helpers

### `$try(subject)`

`try/catch` as a tuple. Accepts a promise or a (sync/async) function and resolves to `[error, null]` or `[null, value]` — never throws.

```ts
import { $try } from "@switchboard/common";

const [error, flag] = await $try(client.getFlag("new-checkout"));
if (error) {
  // handle
} else {
  // use flag
}
```

### `payloadType(payload)`

Returns the runtime type of a flag payload as a string: `"undefined" | "null" | "boolean" | "number" | "string"`.

```ts
import { payloadType } from "@switchboard/common";

payloadType(42); // "number"
payloadType(null); // "null"
```
