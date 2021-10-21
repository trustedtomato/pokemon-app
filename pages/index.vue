<template>
  <main>
    <input v-model="inUrl.query" class="main-search" type="search">
    <div class="main-toolbar">
      <label>
        Number of results per page:
        <select v-model="inUrl.limit">
          <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
      <button :disabled="inUrl.page <= 1" @click="pageClick(inUrl.page - 1)">
        Previous
      </button>
      <span v-for="(chunk, i) in pageChunks" :key="i">
        <span v-if="i > 0"> ... </span>
        <button
          v-for="n in chunk"
          :key="n"
          :class="`page-btn ${inUrl.page === n ? 'page-btn--active' : ''}`"
          @click="pageClick(n)"
        >
          {{ n }}
        </button>
      </span>
      <button :disabled="inUrl.page >= maxPage" @click="pageClick(inUrl.page + 1)">
        Next
      </button>
    </div>
    <div class="card-container">
      <PokemonCard
        v-for="result in results.slice((inUrl.page - 1) * inUrl.limit, inUrl.page * inUrl.limit)"
        :key="result.item.id"
        :pokemon-id="result.item.id"
        :name="result.item.name"
        :weight="result.item.weight"
        :abilities="result.item.abilities"
        :height="result.item.height"
        :has-image="result.item.hasImage"
      />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Fuse from 'fuse.js'
import PokemonCard from '@/components/PokemonCard.vue'
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

export default Vue.extend({
  components: {
    PokemonCard
  },
  async asyncData () {
    const res = await axios.get('/generated/pokemons.json') as any
    const pokemons: SimplePokemon[] = res.data
    const fuse = new Fuse(pokemons, {
      keys: ['name', 'abilities']
    })
    return {
      pokemons,
      search: fuse.search.bind(fuse)
    }
  },
  data: () => ({
    limitOptions: [10, 20, 50],
    inUrl: Object.assign(
      {
        query: '',
        limit: 20,
        page: 1
      },
      queryStringToObject(new URLSearchParams(location.search).toString())
    ),
    pokemons: [] as SimplePokemon[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    search: (query: string): SimplePokemon[] => []
  }),
  computed: {
    results () {
      return this.search(this.inUrl.query)
    },
    maxPage () {
      return Math.ceil((this as any).results.length / this.inUrl.limit)
    },
    pageChunks () {
      // The following chunks of pages must always be shown:
      const chunks = [
        // the first page
        { start: 1, end: 2 },
        // the current page, the one before it and the one after it
        { start: this.inUrl.page - 1, end: this.inUrl.page - -2 },
        // the last page
        { start: (this as any).maxPage, end: (this as any).maxPage + 1 }
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
  },
  watch: {
    'inUrl.query' () {
      this.inUrl.page = 1
    },
    inUrl: {
      deep: true,
      handler () {
        history.replaceState(history.state, '', '?' + objectToQueryString(this.inUrl))
      }
    }
  },
  methods: {
    pageClick (page: number) {
      this.inUrl.page = page
    }
  }
})
</script>
