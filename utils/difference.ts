export function subtract <T extends Record<any, any>> (obj1: T, obj2: Record<any, any>): Partial<T> {
  const res: Partial<T> = {}
  for (const [key, value] of Object.entries(obj1)) {
    if (!Object.is(obj2[key], value)) {
      // @ts-ignore
      res[key] = value
    }
  }
  return res
}
