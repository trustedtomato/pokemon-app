<template>
  <div class="toolbar">
    <label>
      Number of results per page:
      <select :value="inUrl.limit" @input="updateInUrl({ limit: $event.target.value })">
        <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </label>
    <label>
      Sort by:
      <select :value="inUrl.sort" @input="updateInUrl({ sort: $event.target.value })">
        <option v-for="[key, displayedString] in Object.entries(sortOptions)" :key="key" :value="key">{{ displayedString }}</option>
      </select>
    </label>
    <button :disabled="inUrl.page <= 1" class="page-btn" @click="pageClick(inUrl.page - 1)">
      Previous
    </button>
    <span v-for="(chunk, i) in pageButtonChunks" :key="i">
      <span v-if="i > 0"> ... </span>
      <button
        v-for="n in chunk"
        :key="n"
        :class="`page-btn ${inUrl.page === n ? 'page-btn--active' : ''}`"
        @click="pageClick(n)"
      >
        {{ n }}
      </button>
    </span>
    <button :disabled="inUrl.page >= maxPage" class="page-btn" @click="pageClick(inUrl.page + 1)">
      Next
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState, mapActions } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState('search-options', ['limitOptions', 'inUrl', 'sortOptions']),
    ...mapGetters('search-options', ['search', 'results', 'maxPage', 'pageButtonChunks'])
  },
  methods: {
    ...mapActions('search-options', ['updateInUrl']),
    pageClick (page: number) {
      this.updateInUrl({ page })
    }
  }
})
</script>
