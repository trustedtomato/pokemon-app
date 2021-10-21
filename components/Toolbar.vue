<template>
  <div class="toolbar">
    <label>
      Number of results per page:
      <select :value="inUrl.limit" @input="updateInUrl({ limit: $event.target.value })">
        <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </label>
    <button :disabled="inUrl.page <= 1" class="page-btn" @click="pageClick(inUrl.page - 1)">
      Previous
    </button>
    <span v-for="(chunk, i) in pageChunks" :key="i">
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
    ...mapState('search-options', ['limitOptions', 'inUrl']),
    ...mapGetters('search-options', ['search', 'results', 'maxPage', 'pageChunks', 'queryString'])
  },
  methods: {
    ...mapActions('search-options', ['updateInUrl']),
    pageClick (page: number) {
      this.updateInUrl({ page })
    }
  }
})
</script>
