<template>
  <div class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidebar-head">
      Корпоративный ресурс ОСФР
      <br>по г. Москве и Московской области
    </div>
    <div class="sidebar-scroll-content">
      <div
        class="sidebar-category"
        :class="{ 'active': selectedCategoryId === null }"
        @click="selectCategory(null)"
      >
        Все категории
      </div>

      <div 
        v-for="category in categories"
        :key="category.id"
        class="sidebar-category"
        :class="{ 'active': selectedCategoryId === category.id }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { Category } from '@/types';

export default defineComponent({
  name: 'Sidebar',
  props: {
    categories: {
      type: Array as PropType<Category[]>,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      selectedCategoryId: null as number | string | null,
      isMobile: false,
      isCollapsed: false,
    };
  },
  methods: {
    selectCategory(categoryId: number | string | null) {
      this.selectedCategoryId = categoryId;
      this.$emit('select-category', categoryId);
      if (this.isMobile) {
        this.isCollapsed = true;
      }
    },
  },
  emits: ['select-category']
});
</script>

<style scoped>
.sidebar {
  width: 25.625rem;
  background: linear-gradient(
    to right,
    #0983FE 0%,
    #1057BC 37%,
    #1A185C 100%
  );
  color: white;
  height: 100vh;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  z-index: 999;
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;

}

.sidebar-head {
  flex-shrink: 0;
  font-size: 32px;
  font-family: 'Lato-SemiBold';
  padding: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  letter-spacing: 0.03em;
  position: relative;
}

.sidebar-scroll-content {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 1rem;
}



.sidebar-category {
  padding: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-size: 28px;
}

.sidebar-category:hover {
  background: linear-gradient(
    to right,
    #5CA4FC 0%,
    #3C8CEE 100%
  );
}

.sidebar-category.active {
  background: linear-gradient(
    to right,
    #5CA4FC 0%,
    #3C8CEE 100%
  );

}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  display: none;
}


@media (max-width: 1200px) {
  .sidebar {
    width: 20rem;
  }
  .sidebar-head {
    font-size: 28px;
  }
  .sidebar-category {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .sidebar.is-collapsed {
    transform: translateX(0);
  }

  .sidebar-head {
    text-align: left;
    font-size: 24px;
  }

  .close-btn {
    display: block;
  }
}


.sidebar-scroll-content::-webkit-scrollbar {
  width: 8px; 
}
.sidebar-scroll-content::-webkit-scrollbar-thumb {
  background-color: #5CA4FC;
  border-radius: 4px;
}
</style>