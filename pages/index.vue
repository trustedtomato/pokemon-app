<template>
  <main>
    <label class="main-search">
      <SearchIcon />
      <input
        :value="inUrl.query"
        class="main-search__input"
        type="search"
        @input="updateInUrl({ query: $event.target.value, page: 1 })"
      >
    </label>
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
        @click.native="pushInUrlUpdate({ 'show-details-of': result.item.id })"
      />
    </div>
    <div v-else style="margin: 1em;">
      <em>There are no results for this query!</em>
    </div>
    <Toolbar />
    <PokemonDetails />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import PokemonCard from '@/components/PokemonCard.vue'
import Toolbar from '~/components/Toolbar.vue'
import SearchIcon from '~/components/SearchIcon.vue'
import PokemonDetails from '~/components/PokemonDetails.vue'

export default Vue.extend({
  components: {
    PokemonCard,
    Toolbar,
    SearchIcon,
    PokemonDetails
  },
  computed: {
    ...mapState('search-options', ['inUrl']),
    ...mapGetters('search-options', ['search', 'results', 'maxPage', 'queryString', 'getLinkForInUrlUpdate']),
    resultsOnPage () {
      return this.results.slice((this.inUrl.page - 1) * this.inUrl.limit, this.inUrl.page * this.inUrl.limit)
    }
  },
  watch: {
    // Keep query string in sync with state updates.
    inUrl: {
      deep: true,
      handler () {
        if (location.search !== '?' + this.queryString) {
          this.$router.replace('?' + this.queryString)
        }
      }
    },
    // Keep state in sync with query string updates.
    '$route' (newRoute) {
      const newUrl = new URL(newRoute.fullPath, location.href)
      if (
        newUrl.origin === location.origin &&
        newUrl.pathname === location.pathname
      ) {
        // @ts-ignore
        this.queryStringToState(newUrl.search)
      }
    }
  },
  created () {
    // @ts-ignore
    this.fetchPokemons()
    // Initalize state based on the query string.
    // @ts-ignore
    this.queryStringToState(location.search)
  },
  methods: {
    ...mapActions('search-options', ['fetchPokemons', 'queryStringToState', 'updateInUrl']),
    pushInUrlUpdate (update: any) {
      this.$router.push(this.getLinkForInUrlUpdate(update))
    }
  }
})
</script>
