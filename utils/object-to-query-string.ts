export function objectToQueryString (obj: Record<string, string>): string {
  const urlSearchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(obj)) {
    urlSearchParams.set(key, value)
  }
  return urlSearchParams.toString()
}
