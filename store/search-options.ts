import { Module, VuexModule, MutationAction, Mutation, Action } from 'vuex-module-decorators'
import axios from 'axios'
import Fuse from 'fuse.js'
import { store } from '.'
import { objectToQueryString } from '@/utils/object-to-query-string'
import { queryStringToObject } from '@/utils/query-string-to-object'
import { range } from '@/utils/range'
import { getPokemonListUrl } from '@/utils/urls'
import { subtract } from '~/utils/difference'

interface SimplePokemon {
  id: number
  name: string
  height: number
  weight: number
  abilities: string[]
  hasImage: boolean
}

const sortOptions = {
  'best-match': 'Best match',
  name: 'Name (A to Z)',
  'name-rev': 'Name (Z to A)',
  weight: 'Weight (Lower to higher)',
  'weight-rev': 'Weight (Higher to lower)',
  height: 'Height (Lower to higher)',
  'height-rev': 'Height (Higher to lower)'
}

const createBasicPokemonFilter = (q: string) => {
  const qLowerCase = q.toLowerCase()
  return (pokemon: SimplePokemon) =>
    pokemon.name.toLowerCase().includes(qLowerCase) ||
    pokemon.abilities.some(ability => ability.toLowerCase().includes(qLowerCase))
}

const createSearchBasedOnCompareFunc = (
  compare: (a: SimplePokemon, b: SimplePokemon) => number,
  self: SearchOptions
) =>
  (q: string) =>
    self.pokemons
      .filter(createBasicPokemonFilter(q))
      .sort(compare)
      .map(item => ({ item }))

const defaultInUrl = {
  query: '',
  limit: 20,
  page: 1,
  sort: Object.keys(sortOptions)[0] as keyof typeof sortOptions,
  'show-details-of': NaN
}

@Module({
  name: 'search-options',
  stateFactory: true,
  namespaced: true,
  dynamic: true,
  store
})
export default class SearchOptions extends VuexModule {
  pokemons: SimplePokemon[] = []
  limitOptions = [10, 20, 50]
  sortOptions = sortOptions
  // This inUrl is always kept in sync with the page.
  inUrl = { ...defaultInUrl }

  get detailedPokemon () {
    return this.pokemons
      .find(pokemon => pokemon.id === this.inUrl['show-details-of'])
  }

  get search (): ((q: string) => { item: SimplePokemon }[]) {
    switch (this.inUrl.sort) {
      case 'best-match': {
        const fuse = new Fuse(this.pokemons, {
          keys: ['name', 'abilities']
        })
        return (q: string) => (
          q === ''
            // Fuse.js return an empty array on empty query.
            // Let's return all the Pokemons instead.
            ? this.pokemons.map(item => ({ item }))
            : fuse.search(q)
        )
      }
      case 'name': {
        return createSearchBasedOnCompareFunc(
          (a, b) => a.name.localeCompare(b.name),
          this
        )
      }
      case 'name-rev': {
        return createSearchBasedOnCompareFunc(
          (a, b) => b.name.localeCompare(a.name),
          this
        )
      }
      case 'weight': {
        return createSearchBasedOnCompareFunc(
          (a, b) => a.weight - b.weight,
          this
        )
      }
      case 'weight-rev': {
        return createSearchBasedOnCompareFunc(
          (a, b) => b.weight - a.weight,
          this
        )
      }
      case 'height': {
        return createSearchBasedOnCompareFunc(
          (a, b) => a.height - b.height,
          this
        )
      }
      case 'height-rev': {
        return createSearchBasedOnCompareFunc(
          (a, b) => b.height - a.height,
          this
        )
      }
      default:
        throw new Error('Unknown sorting key!')
    }
  }

  get results () {
    return this.search(this.inUrl.query)
  }

  get maxPage () {
    return Math.ceil(this.results.length / this.inUrl.limit)
  }

  get pageButtonChunks () {
    // The following chunks of page buttons must always be shown:
    const chunks = [
      // the first page
      { start: 1, end: 2 },
      // the current page, the one before it and the one after it
      { start: this.inUrl.page - 1, end: this.inUrl.page + 2 },
      // the last page
      { start: this.maxPage, end: this.maxPage + 1 }
    ]
    // The page chunks shall be merged when the distance between
    // the end of a chunk and the beginning of the next chunk
    // is just one page away from each other.
    const joinedChunks = [{ ...chunks[0] }]
    for (let i = 1; i < chunks.length; i++) {
      if (chunks[i].start <= chunks[i - 1].end - 1) {
        joinedChunks[joinedChunks.length - 1].end = chunks[i].end
      } else {
        joinedChunks.push({ ...chunks[i] })
      }
    }
    return joinedChunks.map(chunk => range(chunk.start, chunk.end, 1))
  }

  @MutationAction({ mutate: ['pokemons'] })
  async fetchPokemons () {
    const res = await axios.get(getPokemonListUrl()) as any
    const pokemons: SimplePokemon[] = res.data
    return {
      pokemons
    }
  }

  @Mutation
  QUERY_STRING_TO_STATE (queryString: string) {
    this.inUrl = {
      ...defaultInUrl,
      ...queryStringToObject(queryString, this.inUrl)
    }
  }

  @Action({ commit: 'QUERY_STRING_TO_STATE', rawError: true })
  queryStringToState (queryString: string) {
    return queryString
  }

  get stateToQueryString () {
    return (update?: unknown) => {
      const query = objectToQueryString(
        subtract(Object.assign({}, this.inUrl, update), defaultInUrl)
      )
      return !query ? '' : `?${query}`
    }
  }

  get currentStateQueryString () {
    return this.stateToQueryString()
  }

  @Mutation
  UPDATE_IN_URL (update: any) {
    Object.assign(this.inUrl, update)
  }

  @Action({ commit: 'UPDATE_IN_URL', rawError: true })
  updateInUrl (updated: any) {
    return updated
  }
}
