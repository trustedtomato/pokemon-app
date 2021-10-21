<template>
  <article class="card">
    <div class="card__content">
      <img v-if="hasImage" :src="imageUrl" :alt="name" loading="lazy">
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
    },
    hasImage: {
      required: true,
      type: Boolean
    }
  },
  computed: {
    imageUrl () {
      return this.hasImage ? `/generated/pokemon-images/${this.pokemonId}.png` : null
    }
  }
})
</script>
