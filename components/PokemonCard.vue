<template>
  <article class="card">
    <div class="card__content">
      <img :src="imageUrl" :alt="name">
    </div>
    <div class="card__content">
      <h1>{{ name }}</h1>
      <ul>
        <li>Height: {{ height }}</li>
        <li>Weight: {{ weight }}</li>
        <li>Abilities: {{ abilities.join(', ') }}</li>
      </ul>
    </div>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    pokemonId: {
      required: true,
      type: Number
    },
    name: {
      required: true,
      type: String
    },
    weight: {
      required: true,
      type: Number
    },
    height: {
      required: true,
      type: Number
    },
    abilities: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    imageUrl () {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemonId}.png`
    }
  }
})
</script>
