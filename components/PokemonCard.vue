<template>
  <button class="card">
    <div class="card__content">
      <div class="card__image">
        <img :src="`${imageUrl}`" :alt="pokemon.name">
      </div>
    </div>
    <div class="card__content">
      <h1>{{ pokemon.name }}</h1>
    </div>
    <table>
      <tr><td style="width: 4.2em;">Height</td><td>{{ pokemon.height }}</td></tr>
      <tr><td>Weight</td><td>{{ pokemon.weight }}</td></tr>
      <tr><td>Abilities</td><td>{{ pokemon.abilities.join(', ') }}</td></tr>
    </table>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { getPokemonImageUrl } from '@/utils/urls'

export default Vue.extend({
  props: {
    pokemon: {
      required: true,
      type: Object
    }
  },
  computed: {
    imageUrl () {
      return getPokemonImageUrl(this.pokemon)
    }
  }
})
</script>
