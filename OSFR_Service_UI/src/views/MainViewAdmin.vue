<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/api/auth';
import SearchInput from '@/components/SearchInput.vue';
import CategoryDropdown from '@/components/CategoryDropdown.vue';
import MainTable from '@/components/MainTable.vue';

interface TableItem {
    id: number | string;
    category_id: number | string;
    category_name?: string;
    name: string;
    service: string | null;
    url: string | null;
    type: 'resource' | 'instruction' | 'software';
}

export default defineComponent({
    name: 'MainViewAdmin',
    components: {
        SearchInput,
        CategoryDropdown,
        MainTable
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
                const response = await api.get<{id: number, name: string}[]>(`/categories`);
                this.categories = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchItems() {
            try {
                const response = await api.get<TableItem[]>(`/admin/all-items`);

                this.items = response.data.map(item => ({
                    ...item,
                    category_name: this.getCategoryName(item.category_id)
                }));

                this.applyFilters();
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
                    (item.service && item.service.toLowerCase().includes(term)) ||
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
      <img src="@/assets/icons/Logo_OSFR.svg" alt="OSFR Logo" class="logo">
    </div>

    <router-link :to="{ name: 'auth'}">
      <button class="admin-btn">Админ</button>
    </router-link>
  </header>

  <div class="name-banner">
    Корпоративный ресурс ОСФР <br>по г. Москве и Московской области
  </div>

  <div class="add-resource-container">
    <router-link :to="{ name: 'resource-add' }" class="add-resource-btn">
      Добавить ресурс
    </router-link>
    <router-link :to="{ name: 'instruction-add' }" class="add-resource-btn">
      Добавить инструкцию
    </router-link>

    <router-link :to="{ name: 'software-add' }" class="add-resource-btn">
      Добавить ПО
    </router-link>
  </div>

  <div class="search-category">
    <SearchInput @search="handleSearch"/>
    <CategoryDropdown @update:category="handleCategoryChange"/>
  </div>

  <div class="resources-table">
    <MainTable
      :items="filteredItems"
      @item-deleted="fetchItems"
    />
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
    line-height: 1.3;
}

.search-category {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2.5rem;
}

.admin-btn {
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
</style>
