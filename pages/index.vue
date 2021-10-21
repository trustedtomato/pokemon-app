<template>
  <main>
    <input
      :value="inUrl.query"
      class="main-search"
      type="search"
      @input="updateInUrl({ query: $event.target.value, page: 1 })"
    >
    <div v-if="results.length > 0">
      <Toolbar />
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
      <Toolbar />
    </div>
    <div v-else style="margin: 1em;">
      There are no results for this query!
    </div>
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
    ...mapGetters('search-options', ['search', 'results', 'maxPage', 'pageChunks', 'queryString'])
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
    this.fetchPokemons()
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
