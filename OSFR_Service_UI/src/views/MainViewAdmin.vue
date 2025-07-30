<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import SearchInput from '@/components/SearchInput.vue';
import CategoryDropdown from '@/components/CategoryDropdown.vue';
import ResourcesTable from '@/components/ResourcesTable.vue';

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
  name: 'MainViewAdmin',
  components: {
    SearchInput,
    CategoryDropdown,
    ResourcesTable
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
        const response = await axios.get<{id: number, name: string}[]>(`${API_BASE_URL}/api/categories`);
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchItems() {
      try {
        const response = await axios.get<TableItem[]>(`${API_BASE_URL}/api/items`);
        
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
    handleCategoryChange(categoryId: number | string | null) {
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

<template>
  <header class="app-header">
    <div class="header-left">
      <img src="/Logo_OSFR.svg" alt="OSFR Logo" class="logo">
    </div>

    <router-link :to="{ name: 'auth'}">
      <button class="login-button">Войти</button>
    </router-link>
    
  </header>

  <div class="name-banner">
    Корпоративный ресурс ОСФР <br>по г. Москве и Московской области
  </div>

  <div class="search-category">
    <SearchInput @search="handleSearch"/>
    <CategoryDropdown @update:category="handleCategoryChange"/>
  </div>

  <div class="resources-table">
    <ResourcesTable :items="filteredItems"/>
  </div>
</template>


<style>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  width: 100%;
  height: 5.5625rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 3.25rem;
  width: 3.9375rem;
  margin-left: 33px;
}

.login-button {
    background-color: #D6E9FD;
    color: #191F66;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.3125rem;
    cursor: pointer;
    width: 7.6875rem;
    height: 2.9375rem;
    font-size: 1.5625rem;
    
    margin-right: 34px;
}

.name-banner {
    width: 100%;
    height: 13.125rem;
    background: linear-gradient(to right, #0983FE 12%, #124AA7 41%, #1A185C 100%);
    color: #FFFFFF; 
    font-size: 4.3125rem;
    font-family: 'Lato-SemiBold';
    letter-spacing: 0.03rem;

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    padding: 1.375rem;
    text-align: center;
}

.search-category {
  display: flex;             
  align-items: center;       
  justify-content: center;   
  gap: 1rem;                 
  flex-wrap: wrap; 
}

</style>