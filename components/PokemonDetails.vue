<template>
  <div id="pokemon-details-modal" class="pokemon-details__container" data-micromodal-close aria-hidden="true">
    <div v-if="detailedPokemon" class="pokemon-details" role="dialog" aria-modal="true" aria-labelledby="Pokemon details">
      <div class="pokemon-details__close">
        <nuxt-link
          class="pokemon-details__close"
          aria-label="Close modal"
          data-micromodal-close
          :to="linkToSearchPage"
        >
          ← Go back to search
        </nuxt-link>
      </div>
      <div class="pokemon-details__data">
        <div class="pokemon-details__image">
          <img
            :src="imageUrl"
            :alt="detailedPokemon.name"
          >
        </div>
        <div>
          <h1>
            {{ detailedPokemon && detailedPokemon.name }}
          </h1>
          <table>
            <tr><td style="width: 4.2em;">Height</td><td>{{ detailedPokemon.height }}</td></tr>
            <tr><td>Weight</td><td>{{ detailedPokemon.weight }}</td></tr>
            <tr><td>Abilities</td><td>{{ detailedPokemon.abilities.join(', ') }}</td></tr>
            <tr><td>Types</td><td>{{ extraData ? extraData.types.join(', ') : 'Loading...' }}</td></tr>
          </table>
          <h2>Stats</h2>
          <div class="pokemon-details__stats">
            <Chart
              :chart-data="statChartData"
              :width="4"
              :height="2"
              :options="{
                legend: {
                  display: false
                },
                scales: {
                  yAxes: [{
                    ticks: {
                      suggestedMin: 0,
                      suggestedMax: 100
                    }
                  }]
                }
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { mapGetters } from 'vuex'
import MicroModal from 'micromodal'
import Chart from './Chart'
import { getPokemonImageUrl, getPokemonExtraUrl } from '@/utils/urls'

export default Vue.extend({
  components: {
    Chart
  },
  data: () => ({
    extraData: null as any,
    fetchCancelTokenSource: axios.CancelToken.source()
  }),
  computed: {
    ...mapGetters('search-options', ['detailedPokemon', 'getLinkForInUrlUpdate']),
    imageUrl () {
      return getPokemonImageUrl(this.detailedPokemon)
    },
    statChartData () {
      return !this.extraData
        ? {}
        : {
            labels: Object.keys(this.extraData.stats),
            datasets: [{
              backgroundColor: '#c6b31d',
              data: Object.values(this.extraData.stats)
            }]
          }
    },
    linkToSearchPage () {
      return this.getLinkForInUrlUpdate({
        'show-details-of': NaN
      })
    }
  },
  watch: {
    detailedPokemon () {
      if (this.detailedPokemon) {
        MicroModal.show('pokemon-details-modal', {
          onClose: () => {
            this.$router.push(this.linkToSearchPage as string)
          },
          disableScroll: true,
          openClass: 'pokemon-details__container--open'
        })
        this.extraData = null
        this.fetchCancelTokenSource.cancel()
        this.fetchCancelTokenSource = axios.CancelToken.source()
        axios.get(getPokemonExtraUrl(this.detailedPokemon), {
          cancelToken: this.fetchCancelTokenSource.token
        }).then((res) => {
          this.extraData = res.data
        })
      }
    }
  }
})
</script>
