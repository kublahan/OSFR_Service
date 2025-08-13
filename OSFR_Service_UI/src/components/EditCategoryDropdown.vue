<template>
  <div class="category-dropdown-wrapper" :class="{ 'dropdown-open': isOpen }">
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
        v-for="category in filteredCategories"
        :key="category.id"
        class="category-dropdown-item"
        @click="selectCategory(category.id, category.name)"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

interface Category {
  id: number | string;
  name: string;
}

export default defineComponent({
  name: 'EditCategoryDropdown',
  props: {
    categories: {
      type: Array as () => Category[],
      required: true,
    },
    modelValue: {
      type: [String, Number, null],
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    

    const excludedCategoryIds = [5, 6];


    const filteredCategories = computed(() => {
      return props.categories.filter(category => 
        !excludedCategoryIds.includes(category.id as number)
      );
    });

    const displaySelectedCategory = computed(() => {
      if (props.modelValue === null) {
        return 'Выберите категорию';
      }
      const selected = props.categories.find(c => c.id === props.modelValue);
      return selected ? selected.name : 'Выберите категорию';
    });
    
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectCategory = (id: number | string | null, name: string) => {
      emit('update:modelValue', id);
      isOpen.value = false;
    };

    return {
      isOpen,
      displaySelectedCategory,
      toggleDropdown,
      selectCategory,
      filteredCategories
    };
  },
});
</script>

<style scoped>
.category-dropdown-wrapper {
  position: relative;
  width: 37.938rem;
  height: 3.875rem;
  font-family: 'Inter-Medium';
  z-index: 1000;
}

.category-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 37.938rem;
  height: 3.875rem;
  background: linear-gradient(to right, #0D6EDE 0%, #073B78 100%);
  border: none;
  border-radius: 20px;
  font-size: 1.563rem;
  color: white;
  padding: 0 1rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-dropdown-wrapper.dropdown-open .category-dropdown-header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.category-dropdown-list {
  position: absolute;
  width: 37.938rem;
  background-color: #D6E9FD;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-top: 1px solid #c0d9fa;
  color: white;
}

.category-dropdown-item {
  padding: 0.75rem 1rem;
  font-size: 1.563rem;
  background-image: linear-gradient(to right, #0D6EDE 0%, #073B78 100%);
  cursor: pointer;
  border-bottom: 1px solid rgba(25, 31, 102, 0.1);
}

.category-dropdown-item:last-child {
  border-bottom: none;
}

.category-dropdown-item:hover {
  background-image: none;
  background-color: #9FCDFF;
}

.dropdown-arrow-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
  color: white;
}

.dropdown-arrow-icon.rotated {
  transform: rotate(180deg);
}
</style>