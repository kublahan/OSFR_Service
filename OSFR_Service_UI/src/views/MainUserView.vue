<template>
  <div class="app-container">
    


    <div class="main-layout">

      <Sidebar 
        :categories="categories"
        @select-category="handleCategorySelect"
      />
      

      <div class="content-area">
        <div class="search-container">
          <img src="/Logo_OSFR.svg" alt="OSFR Logo" class="logo">

          <SearchInput 
            @search="handleSearch"
            :customWidth="'72.4375rem'"
            :customMarginLeft="'1.8125rem'"
            />
          
          
          <router-link :to="{ name: 'auth'}">
            <button class="login-button">Войти</button>
          </router-link>
          
          
        </div>

        <div class="selected-category">
          <h2>
            {{ getCurrentCategoryName() }}
            <span v-if="searchTerm"> "{{ searchTerm }}"</span>
          </h2>
        </div>


        <div class="resources-grid">
          <ResourcesButton v-for="item in filteredItems" 
            :key="item.id" 
            :item="item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue';
import SearchInput from '@/components/SearchInput.vue';
import ResourcesTable from '@/components/ResourcesTable.vue';
import ResourcesButton from '../components/ResourcesButton.vue';


interface TableItem {
  id: number | string;
  category_id: number | string;
  category_name?: string;
  name: string;
  service: string;
  url: string;
}

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

export default defineComponent({
  name: 'MainUserView',
  components: {
    Sidebar,
    SearchInput,
    ResourcesTable,
    ResourcesButton
  },
  data() {
    return {
      items: [] as TableItem[],
      filteredItems: [] as TableItem[],
      categories: [] as {id: number, name: string}[],
      searchTerm: '',
      selectedCategory: null as number | string | null
    };
  },
  async created() {
    await this.fetchCategories();
    await this.fetchItems();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchItems() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/items`);
        this.items = response.data.map(item => ({
          ...item,
          category_name: this.getCategoryName(item.category_id)
        }));
        this.filteredItems = [...this.items];
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    getCategoryName(categoryId: number | string): string {
      const category = this.categories.find(c => c.id == categoryId);
      return category ? category.name : `Категория ${categoryId}`;
    },
    handleSearch(term: string) {
      this.searchTerm = term;
      this.applyFilters();
    },
    handleCategorySelect(categoryId: number | string | null) {
      this.selectedCategory = categoryId;
      this.applyFilters();
    },
    applyFilters() {
      let result = [...this.items];
      
      if (this.selectedCategory !== null) {
        result = result.filter(item => item.category_id == this.selectedCategory);
      }
      
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        result = result.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.service.toLowerCase().includes(term) ||
          (item.category_name && item.category_name.toLowerCase().includes(term))
        );
      }
      
      this.filteredItems = result;
    },

    getCurrentCategoryName() {
    if (this.searchTerm) {
      return this.selectedCategory 
        ? `Результаты поиска в ${this.getCategoryName(this.selectedCategory)}` 
        : 'Результаты поиска';
    }
    return this.selectedCategory 
      ? this.getCategoryName(this.selectedCategory)
      : 'Все категории';
    }
  }
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}


.main-layout {
  display: grid;
  grid-template-columns: 25.625rem 1fr;
}

.content-area {
  background-color: #f5f5f5;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  margin-top: 2.25rem;
  width: 94.375rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(21rem, 1fr));
  gap: 1.5rem;
  width: 100%;
}


.login-button {
  background-color: #D6E9FD;
  color: #191F66;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;
  width: 9.65rem;
  height: 3.6875rem;
  font-size: 1.5625rem;
  line-height: 1;

  margin-right: 1.6rem;
  margin-left: 2.1875rem;

  flex-wrap: nowrap;
}

.logo {
  height: 3.6875rem;
  width: 4.5rem;
  margin-left: 2.5625rem;
}

.selected-category {
  padding: 1rem 2.5625rem;
  margin-bottom: 1rem;
  font-family: 'Inter-Extra-Bold';
  color: #191F66;
}

.selected-category h2 {
  font-size: 2.75rem;
  color: #191F66;
  font-weight: 600;
}

.selected-category span {
  color: #1150B0;
  font-weight: normal;
}
</style>