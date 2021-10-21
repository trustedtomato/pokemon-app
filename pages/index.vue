<template>
  <main>
    <input v-model="inUrl.query" type="search">
    <label>
      Number of results per page:
      <select v-model="inUrl.limit">
        <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </label>
    <div class="card-container">
      <PokemonCard
        v-for="result in results.slice(0, 10)"
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
        limit: 20
      },
      queryStringToObject(new URLSearchParams(location.search).toString())
    ),
    pokemons: [] as SimplePokemon[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    search: (query: string) => []
  }),
  computed: {
    results () {
      return this.search(this.inUrl.query)
    }
  },
  watch: {
    inUrl: {
      deep: true,
      handler () {
        history.replaceState(history.state, '', '?' + objectToQueryString(this.inUrl))
      }
    }
  }
})
</script>
