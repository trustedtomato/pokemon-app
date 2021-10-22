<template>
  <div v-show="detailedPokemon" class="pokemon-details__container">
    <div v-if="detailedPokemon" class="pokemon-details">
      <div class="pokemon-details__close">
        <nuxt-link
          class="pokemon-details__close"
          :to="getUpdateInUrlLink({
            'show-details-of': NaN
          })"
        >
          ← Go back to search
        </nuxt-link>
      </div>
      <div class="pokemon-details__data">
        <div class="pokemon-details__image">
          <img
            :src="`/generated/pokemon-images/${detailedPokemon.id}.png`"
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
import Chart from './Chart'

export default Vue.extend({
  components: {
    Chart
  },
  data: () => ({
    extraData: null as any,
    fetchCancelTokenSource: axios.CancelToken.source()
  }),
  computed: {
    ...mapGetters('search-options', ['detailedPokemon', 'getUpdateInUrlLink']),
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
    }
  },
  watch: {
    detailedPokemon () {
      if (this.detailedPokemon) {
        document.body.style.overflow = 'hidden'
        this.extraData = null
        this.fetchCancelTokenSource.cancel()
        this.fetchCancelTokenSource = axios.CancelToken.source()
        axios.get(`/generated/pokemon-extra/${this.detailedPokemon.id}.json`, {
          cancelToken: this.fetchCancelTokenSource.token
        }).then((res) => {
          this.extraData = res.data
        })
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  }
})
</script>
