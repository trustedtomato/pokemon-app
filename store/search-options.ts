import { Module, VuexModule, MutationAction, Mutation, Action } from 'vuex-module-decorators'
import axios from 'axios'
import Fuse from 'fuse.js'
import { store } from '.'
import { objectToQueryString } from '@/utils/object-to-query-string'
import { queryStringToObject } from '@/utils/query-string-to-object'
import { range } from '@/utils/range'

interface SimplePokemon {
  name: string
  height: number
  weight: number
  abilities: string[]
  hasImage: boolean
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
  inUrl = {
    query: '',
    limit: 20,
    page: 1
  }

  get search () {
    const fuse = new Fuse(this.pokemons, {
      keys: ['name', 'abilities']
    })
    return fuse.search.bind(fuse)
  }

  get results () {
    return this.search(this.inUrl.query)
  }

  get maxPage () {
    return Math.ceil(this.results.length / this.inUrl.limit)
  }

  get pageChunks () {
    // The following chunks of pages must always be shown:
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
    const res = await axios.get('/generated/pokemons.json') as any
    const pokemons: SimplePokemon[] = res.data
    return {
      pokemons
    }
  }

  @Mutation
  QUERY_STRING_TO_STATE (queryString: string) {
    for (const [key, value] of Object.entries(queryStringToObject(queryString))) {
      console.log(queryString, key)
      // @ts-ignore
      if (typeof this.inUrl[key] === 'number') {
        // @ts-ignore
        this.inUrl[key] = Number(value)
        // @ts-ignore
      } else if (typeof this.inUrl[key] === 'string') {
        // @ts-ignore
        this.inUrl[key] = value
      } else {
        console.error(`Could not identify query string key: ${key}`)
      }
    }
  }

  @Action({ commit: 'QUERY_STRING_TO_STATE', rawError: true })
  queryStringToState (queryString: string) {
    return queryString
  }

  get queryString () {
    return objectToQueryString(this.inUrl)
  }

  @Mutation
  UPDATE_IN_URL (updated: any) {
    Object.assign(this.inUrl, updated)
  }

  @Action({ commit: 'UPDATE_IN_URL', rawError: true })
  updateInUrl (updated: any) {
    return updated
  }
}
