type TrySuccess<T> = [null, T];
type TryError = [Error, null];
type TryResult<T> = TrySuccess<T> | TryError;

export const $try = async <T>(
  subject: Promise<T> | (() => T) | (() => Promise<T>),
): Promise<TryResult<T>> => {
  try {
    return [
      null,
      typeof subject == "function" ? await subject() : await subject,
    ];
  } catch (e) {
    const error = e instanceof Error ? e : new Error(`${e}`);
    return [error, null];
  }
};
