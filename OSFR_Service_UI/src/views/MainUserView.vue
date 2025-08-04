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
            />
          
          
          <router-link :to="{ name: 'auth'}">
            <button class="login-button">Войти</button>
          </router-link>
          
          
        </div>
        
        <ResourcesButton :items="filteredItems"/>
        <!-- <ResourcesTable :items="filteredItems"/> -->
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
  grid-template-columns: 25.625rem 1fr; /* Сайдбар 200px, контент - остальное */
  flex: 1;
}

.content-area {
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
}

.search-container {
  align-items: center; /* Выравнивает по центру по вертикали */
  margin-bottom: 2rem;
  gap: 1rem;
  margin-top: 2.25rem;
  justify-content: right;
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
}

.logo {
  height: 3.6875rem;
  width: 4.5rem;
  margin-left: 35px;
}
</style>