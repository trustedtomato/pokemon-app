export function objectToQueryString (obj: Record<string, string | number>): string {
  const urlSearchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(obj)) {
    urlSearchParams.set(key, String(value))
  }
  return urlSearchParams.toString()
}
