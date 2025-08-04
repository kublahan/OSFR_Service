<template>
  <input
    :style="{ width: customWidth }"
    type="text"
    v-model="searchTerm"
    @input="emitSearch"
    placeholder="Поиск..."
    class="search-input"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchInput',
  data() {
    return {
      searchTerm: '',
    };
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.searchTerm);
    },
  },
  props: {
    customWidth: {
      type: String,
      default: '66.5rem'
    }
  }
});
</script>

<style>


.search-input {
  
  height: 3.6875rem;
  background-color: #D6E9FD;
  border: none;
  border-radius: 0.625rem;
  margin-left: 9.375rem;


  background-image: url('@/assets/icons/Search_Magnifying_Glass.svg');
  background-repeat: no-repeat;
  background-position: 21px center;
  background-size: 1.5rem;
  padding-left: 3rem;

  font-family: 'Inter-Regular';
  font-size: 1.5625rem;

}

.search-input::placeholder {
  font-family: 'Inter-Regular';
  font-size: 1.5625rem;
  color: #000000;
  opacity: 0.6;
}
</style>