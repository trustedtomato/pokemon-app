<template>
  <button class="card">
    <div class="card__content">
      <div class="card__image" :style="`background-image: url(${imageUrl || 'question-mark.svg'})`" />
    </div>
    <div class="card__content">
      <h1>{{ name }}</h1>
    </div>
    <table>
      <tr><td style="width: 4.2em;">Height</td><td>{{ height }}</td></tr>
      <tr><td>Weight</td><td>{{ weight }}</td></tr>
      <tr><td>Abilities</td><td>{{ abilities.join(', ') }}</td></tr>
    </table>
  </button>
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
