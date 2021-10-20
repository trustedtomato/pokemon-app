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
}

export default Vue.extend({
  components: {
    PokemonCard
  },
  async asyncData () {
    const res = await axios.post('https://beta.pokeapi.co/graphql/v1beta', {
      operationName: 'search',
      query: `
        query search {
          pokemon_v2_pokemon {
            height
            name
            weight
            pokemon_v2_pokemonabilities {
              pokemon_v2_ability {
                name
              }
            }
            id
          }
        }
      `
    }) as any
    const pokemons: SimplePokemon[] = res.data.data.pokemon_v2_pokemon.map(({
      height,
      name,
      weight,
      // eslint-disable-next-line camelcase
      pokemon_v2_pokemonabilities,
      id
    }: any) => ({
      height,
      name: (name.slice(0, 1).toUpperCase() + name.slice(1)).replace(/-/g, ' '),
      weight,
      abilities: pokemon_v2_pokemonabilities.map(({ pokemon_v2_ability: { name } }: any) => name),
      id
    }))
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
