import { SimplePokemon } from '@/types/SimplePokemon'

/**
 * Turns "generated/x.png" to "/basename/generated/x.png".
 * Currently does nothing, because a <base> element is placed
 * on the page by Nuxt instead.
 **/
export function getUrl (url: string) {
  // @ts-ignore
  const base = (global || window)?.__NUXT__?.config.base || ''
  return `/${base}${url}`
}

export function getPokemonListUrl () {
  return getUrl('generated/pokemons.json')
}

export function getPokemonImageUrl (pokemon: SimplePokemon) {
  return getUrl(pokemon.hasImage
    ? `generated/pokemon-images/${pokemon.id}.png`
    : 'question-mark.svg'
  )
}

export function getPokemonExtraUrl (pokemon: SimplePokemon) {
  return getUrl(`generated/pokemon-extra/${pokemon.id}.json`)
}
