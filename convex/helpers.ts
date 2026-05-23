export const base64url = (bytes: Uint8Array) => {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

export const generateToken = (prefix = '') => {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return `${prefix ? prefix + '_' : ''}${base64url(bytes)}`
}

export const hashString = async (str: string) => {
  const encoded = new TextEncoder().encode(str)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return base64url(new Uint8Array(digest))
}
