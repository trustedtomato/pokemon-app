<template>
  <main>
    <input v-model="inUrl.search" type="search">
    <label>
      Number of results per page:
      <select v-model="inUrl.limit">
        <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </label>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { objectToQueryString } from '@/utils/object-to-query-string'
import { queryStringToObject } from '@/utils/query-string-to-object'
import { debounce } from '@/utils/debounce'

export default Vue.extend({
  data () {
    let searchCancelToken = this.$axios.CancelToken.source()
    const search = async () => {
      searchCancelToken.cancel('Initiating a new request.')
      searchCancelToken = this.$axios.CancelToken.source()
      const res = await this.$axios.$post('https://beta.pokeapi.co/graphql/v1beta', {
        operationName: 'search',
        query: `
          query search {
            pokemon_v2_pokemon(limit: ${
              // @ts-ignore
              this.inUrl.limit
            }) {
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
      }, {
        cancelToken: searchCancelToken.token
      })
      console.log(res)
    }
    return {
      limitOptions: [10, 20, 50],
      inUrl: Object.assign(
        {
          search: '',
          limit: 20
        },
        queryStringToObject(new URLSearchParams(location.search).toString())
      ),
      search,
      debouncedSearch: debounce(2000, search)
    }
  },
  watch: {
    inUrl: {
      deep: true,
      handler () {
        history.replaceState(history.state, '', '?' + objectToQueryString(this.inUrl))
        this.debouncedSearch()
      }
    }
  },
  created () {
    this.search()
  }
})
</script>
