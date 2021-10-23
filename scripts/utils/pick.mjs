/**
 * Make a new partial object from the given object
 * by only transfering the given keys.
 **/
export function pick (obj, keys) {
  const res = {}
  for (const [key, value] of Object.entries(obj)) {
    if (keys.includes(key)) {
      res[key] = value
    }
  }
  return res
}
