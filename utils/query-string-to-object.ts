export function queryStringToObject (q: string): Record<string, string> {
  // @ts-ignore
  return Object.fromEntries([...new URLSearchParams(q)])
}
