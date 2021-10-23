import axios from 'axios'
import { SimplePokemon } from '@/types/SimplePokemon'

// Axios doesn't seem to care about the <base />,
// so it has to be set separately.
// @ts-ignore
axios.defaults.baseURL = (global || window)?.__NUXT__?.config.base || ''

/**
 * Turns "generated/x.png" to "/basename/generated/x.png".
 * Currently does nothing, because a <base> element is placed
 * on the page by Nuxt instead.
 **/
export function getUrl (url: string) {
  return `/${url}`
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
