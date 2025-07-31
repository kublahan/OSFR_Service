<template>
  <div class="category-dropdown-wrapper">

    <div class="category-dropdown-header" @click="toggleDropdown">

      <span>{{ displaySelectedCategory }}</span>

      <svg
        :class="{ 'rotated': isOpen }"
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

    <div v-if="isOpen" class="category-dropdown-list">

      <div
        class="category-dropdown-item"
        @click="selectCategory(null)"
      >
        Все категории
      </div>
      <!-- Динамический список категорий -->
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-dropdown-item"
        @click="selectCategory(category.id, category.name)"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CategoryDropdown',
  data() {
    return {
      categories: [],
      selectedCategoryId: null,
      selectedCategoryName: 'Все категории',
      isOpen: false,
    };
  },
  computed: {
    // Вычисляемое свойство для отображения выбранной категории в заголовке
    displaySelectedCategory() {
      return this.selectedCategoryName;
    }
  },
  async created() {
    try {

      const response = await axios.get('http://localhost:3000/api/categories');

      this.categories = response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },
  methods: {
    /**
     * Переключает состояние открытия/закрытия выпадающего списка.
     */
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    /**
     * Выбирает категорию и закрывает выпадающий список.
     * @param {number|null} id - ID выбранной категории.
     * @param {string} name - Имя выбранной категории.
     */
    selectCategory(id, name = 'Все категории') {
      this.selectedCategoryId = id;
      this.selectedCategoryName = name;
      this.isOpen = false;
      this.emitFilter();
    },

    emitFilter() {

      this.$emit('update:category', this.selectedCategoryId);
    },
  },
};
</script>

<style scoped>


.category-dropdown-wrapper {
  position: relative;
  width: 29.4631rem;
  margin-left: 1rem;
  margin-top: 2.25rem;
  font-family: 'Inter-Regular';
  z-index: 1000;
}

.category-dropdown-header {
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


.category-dropdown-wrapper.open .category-dropdown-header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}


.category-dropdown-list {
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

.category-dropdown-item {
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  color: #191F66;
  cursor: pointer;
  border-bottom: 1px solid rgba(25, 31, 102, 0.1);
}

.category-dropdown-item:last-child {
  border-bottom: none;
}

.category-dropdown-item:hover {
  background-color: #c0d9fa;
}

.category-dropdown-item.disabled {
  color: #999;
  cursor: default;
  pointer-events: none;
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
