<template>
  <main>
    <input
      :value="inUrl.query"
      class="main-search"
      type="search"
      @input="updateInUrl({ query: $event.target.value, page: 1 })"
    >
    <Toolbar />
    <div v-if="results.length > 0" class="card-container">
      <PokemonCard
        v-for="result in resultsOnPage"
        :key="result.item.id"
        :pokemon-id="result.item.id"
        :name="result.item.name"
        :weight="result.item.weight"
        :abilities="result.item.abilities"
        :height="result.item.height"
        :has-image="result.item.hasImage"
      />
    </div>
    <div v-else style="margin: 1em;">
      <em>There are no results for this query!</em>
    </div>
    <Toolbar />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import PokemonCard from '@/components/PokemonCard.vue'
import Toolbar from '~/components/Toolbar.vue'

export default Vue.extend({
  components: {
    PokemonCard,
    Toolbar
  },
  computed: {
    ...mapState('search-options', ['limitOptions', 'inUrl']),
    ...mapGetters('search-options', ['search', 'results', 'maxPage', 'pageChunks', 'queryString']),
    resultsOnPage () {
      return this.results.slice((this.inUrl.page - 1) * this.inUrl.limit, this.inUrl.page * this.inUrl.limit)
    }
  },
  watch: {
    inUrl: {
      deep: true,
      handler () {
        history.replaceState(history.state, '', '?' + this.queryString)
      }
    }
  },
  created () {
    // @ts-ignore
    this.fetchPokemons()
    // @ts-ignore
    this.queryStringToState(location.search)
  },
  methods: {
    ...mapActions('search-options', ['fetchPokemons', 'queryStringToState', 'updateInUrl']),
    pageClick (page: number) {
      this.inUrl.page = page
    }
  }
})
</script>
