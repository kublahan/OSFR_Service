<script>
export default {
  name: 'CategoryDropdown',
  data() {
    return {
      isOpen: false,
      selectedCategory: 'Все категории',
      categories: [
        'Все категории',
        'Основные ресурсы',
        'Коммуникационные сервисы',
        'Прямые ссылки портала сотрудника',
        'Парус',
        'Инструкции',
        'Перечень ПО'
      ]
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectCategory(category) {
      if (category !== this.selectedCategory) {
        this.selectedCategory = category;
      }
      this.isOpen = false;
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<template>
  <div class="category-dropdown-wrapper" @click.stop>
    <div 
      class="category-dropdown-header"
      @click="toggleDropdown"
    >
      <span>{{ selectedCategory }}</span>
      <img
        src="@/assets/icons/Vector.svg"
        alt="Стрелка"
        class="dropdown-arrow-icon"
        :class="{ 'rotated': isOpen }"
      />
    </div>
    
    <div 
      class="category-dropdown-list"
      v-show="isOpen"
    >
      <div 
        class="category-dropdown-item"
        v-for="(category, index) in categories"
        :key="index"
        @click="selectCategory(category)"
        :class="{ 'disabled': category === selectedCategory }"
      >
        {{ category }}
      </div>
    </div>
  </div>
</template>

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
  border-top-right-radius: 0.625rem;
  border-top-left-radius: 0.625rem;
  font-size: 1.5625rem;
  color: #191F66;
  padding: 0 1rem;
  cursor: pointer;
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
}

.category-dropdown-item {
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  color: #191F66;
  cursor: pointer;
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