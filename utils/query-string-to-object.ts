/**
 * Creates an object based on the query string given.
 * Only keeps the parameters which are found in "base" as a key.
 * Tries to convert each query parameter to the type which was found in base.
 **/
export function queryStringToObject (q: string, base: Record<string, string | number>): Record<string, number> {
  return Object.fromEntries(
    // @ts-ignore
    [...new URLSearchParams(q)]
      .map(([key, value]) => {
        if (typeof base[key] === 'number') {
          return [key, Number(value)]
        } else if (typeof base[key] === 'string') {
          return [key, value]
        } else {
          return undefined
        }
      })
      // Filter out undefined
      .filter(x => x)
  )
}
