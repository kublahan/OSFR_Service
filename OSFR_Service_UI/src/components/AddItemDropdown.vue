<template>
    <div class="add-dropdown-wrapper">
      <div class="add-dropdown-header" @click="toggleDropdown">
        <span>Добавить...</span>
        <svg
          :class="{ 'rotated': isDropdownOpen }"
          class="dropdown-arrow-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      <div v-if="isDropdownOpen" class="add-dropdown-list">
        <router-link :to="{ name: 'resource-add' }" class="add-dropdown-item">
          Добавить ресурс
        </router-link>
        <router-link :to="{ name: 'instruction-add' }" class="add-dropdown-item">
          Добавить инструкцию
        </router-link>
        <router-link :to="{ name: 'software-add' }" class="add-dropdown-item">
          Добавить ПО
        </router-link>
      </div>
    </div>
</template>
<script>
export default {
  name: 'AddItemDropdown',
  data() {
    return {
      isDropdownOpen: false
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  }
};
</script>
<style scoped>
.add-dropdown-wrapper {
  position: relative;
  width: 21.5rem;
  font-family: 'Inter-Regular';
  z-index: 999;
}

.add-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3.9375rem;
  background-color: #D6E9FD;
  border: none;
  border-radius: 0.625rem;
  font-size: 1.5625rem;
  color: #191F66;
  padding: 0 1rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #D6E9FD;
  border-radius: 0 0 0.625rem 0.625rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-top: 1px solid #c0d9fa;
}

.add-dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  color: #191F66;
  cursor: pointer;
  text-decoration: none;
  border-bottom: 1px solid rgba(25, 31, 102, 0.1);
  transition: background-color 0.2s;
}

.add-dropdown-item:last-child {
  border-bottom: none;
}

.add-dropdown-item:hover {
  background-color: #c0d9fa;
}

.dropdown-arrow-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.dropdown-arrow-icon.rotated {
  transform: rotate(180deg);
}

</style>