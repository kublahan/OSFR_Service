<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import SearchInput from '@/components/SearchInput.vue';
import CategoryDropdown from '@/components/CategoryDropdown.vue';
import ResourcesTable from '@/components/ResourcesTable.vue';
import type { PropType } from 'vue';

interface TableItem {
  id: number | string;
  category_id: number | string;
  category_name?: string; // Сделаем необязательным, так как мы его добавляем динамически
  name: string;
  service: string;
  url: string;
}

export default defineComponent({
  name: 'MainView',
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
    console.log('MainView: created hook started.');
    await this.fetchCategories();
    console.log('MainView: Categories fetched. Current categories state:', this.categories);
    await this.fetchItems();
    console.log('MainView: Items fetched. Final items state (with category names):', this.items);
  },
  methods: {
    async fetchCategories() {
      try {
        console.log('fetchCategories: Attempting to fetch categories from http://localhost:3000/api/categories');
        const response = await axios.get<{id: number, name: string}[]>('http://localhost:3000/api/categories');
        this.categories = response.data;
        console.log('fetchCategories: Successfully fetched categories:', this.categories);
        if (this.categories.length === 0) {
          console.warn('fetchCategories: No categories returned by the API!');
        }
      } catch (error) {
        console.error('fetchCategories: Error fetching categories:', error);
      }
    },
    async fetchItems() {
      try {
        console.log('fetchItems: Attempting to fetch items from http://localhost:3000/api/items');
        const response = await axios.get<TableItem[]>('http://localhost:3000/api/items');
        
        console.log('fetchItems: Raw items from API:', response.data);
        console.log('fetchItems: Categories available for mapping:', this.categories); // Проверим категории перед маппингом

        // Добавляем названия категорий к каждому элементу
        this.items = response.data.map(item => {
          const categoryName = this.getCategoryName(item.category_id);
          console.log(`fetchItems: Mapping item ID ${item.id}, category_id ${item.category_id} -> category_name: ${categoryName}`);
          return {
            ...item,
            category_name: categoryName
          };
        });
        this.filteredItems = [...this.items];
        console.log('fetchItems: Final processed items with category names:', this.items);
      } catch (error) {
        console.error('fetchItems: Error fetching items:', error);
      }
    },
    getCategoryName(categoryId: number | string): string {
      console.log(`getCategoryName: Looking for category ID: ${categoryId} (type: ${typeof categoryId})`);
      console.log('getCategoryName: Available categories:', this.categories.map(c => ({ id: c.id, type: typeof c.id })));

      // Используем == для гибкого сравнения типов (число vs строка)
      const category = this.categories.find(c => c.id == categoryId);
      
      if (!category) {
        console.warn(`getCategoryName: Category with ID ${categoryId} NOT FOUND in loaded categories. Returning fallback name.`);
        return `Категория ${categoryId}`;
      }
      console.log(`getCategoryName: Found category for ID ${categoryId}: ${category.name}`);
      return category.name;
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
        console.log(`applyFilters: Filtering by category ID: ${this.selectedCategory} (type: ${typeof this.selectedCategory})`);
        result = result.filter(item => item.category_id == this.selectedCategory);
      }
      
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        console.log(`applyFilters: Filtering by search term: "${term}"`);
        result = result.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.service.toLowerCase().includes(term) ||
          (item.category_name && item.category_name.toLowerCase().includes(term))
        );
      }
      
      this.filteredItems = result;
      console.log('applyFilters: Filtered items:', this.filteredItems);
    }
  }
});
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <img src="@/assets/icons/Logo_OSFR.jpg" alt="OSFR Logo" class="logo">
    </div>
    <button class="login-button">Войти</button>
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