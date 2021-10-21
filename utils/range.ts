export function range (from: number, to: number, increment: number) {
  const ns: number[] = []
  for (let n = from; n < to; n += increment) {
    ns.push(n)
  }
  return ns
}
