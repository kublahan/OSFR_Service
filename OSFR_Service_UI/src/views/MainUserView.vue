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
        </div>
        <div class="selected-category">
          <h2>
            {{ getCurrentCategoryName() }}
            <span v-if="searchTerm"> "{{ searchTerm }}"</span>
          </h2>
        </div>
        <div class="resources-grid">
          <ResourcesButton 
            v-for="item in filteredItems" 
            :key="item.id" 
            :item="item"
            @action="handleItemAction"
          />
          <div v-if="filteredItems.length === 0" class="no-data">
            Нет данных для отображения.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import api from '@/api/auth'; // Импортируем api
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import SearchInput from '@/components/SearchInput.vue';
import ResourcesButton from '../components/ResourcesButton.vue';

interface TableItem {
    id: number | string;
    category_id: number | string;
    category_name?: string;
    name: string;
    service: string | null;
    url: string | null;
    type: 'resource' | 'instruction' | 'software';
}

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

export default defineComponent({
  name: 'MainUserView',
  components: {
    Sidebar,
    SearchInput,
    ResourcesButton
  },
  setup() {
    const router = useRouter();
    const items = ref<TableItem[]>([]);
    const filteredItems = ref<TableItem[]>([]);
    const categories = ref<{ id: number | string, name: string }[]>([]);
    const searchTerm = ref('');
    const selectedCategory = ref<number | string | null>(null);
    const isMobile = ref(false);

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    onMounted(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        categories.value = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/items`);
        items.value = response.data.map((item: any) => ({
          ...item,
          category_name: getCategoryName(item.category_id),
          type: item.type || 'resource'
        }));
        applyFilters();
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    const getCategoryName = (categoryId: number | string): string => {
      const category = categories.value.find(c => c.id == categoryId);
      return category ? category.name : `Категория ${categoryId}`;
    };

    const handleSearch = (term: string) => {
      searchTerm.value = term;
      applyFilters();
    };

    const handleCategorySelect = (categoryId: number | string | null) => {
      selectedCategory.value = categoryId;
      applyFilters();
    };

    const applyFilters = () => {
      let result = items.value;
      
      if (selectedCategory.value !== null) {
        result = result.filter(item => item.category_id == selectedCategory.value);
      }
      
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        result = result.filter(item => 
          item.name.toLowerCase().includes(term) || 
          (item.service && item.service.toLowerCase().includes(term)) ||
          (item.category_name && item.category_name.toLowerCase().includes(term))
        );
      }
      
      filteredItems.value = result;
    };

    const getCurrentCategoryName = () => {
      if (searchTerm.value) {
        return selectedCategory.value
          ? `Результаты поиска в ${getCategoryName(selectedCategory.value)}`
          : 'Результаты поиска';
      }
      return selectedCategory.value
        ? getCategoryName(selectedCategory.value)
        : 'Все категории';
    };

    const handleItemAction = (item: TableItem) => {
      if (item.type === 'resource' && item.url) {
        window.open(item.url, '_blank');
      } else if (item.type === 'instruction') {
        router.push({ name: 'instruction-view', params: { id: item.id } });
      } else if (item.type === 'software') {
        downloadItem(item);
      }
    };

    const downloadItem = async (item: TableItem) => {
      if (item.type !== 'software') return;
      try {
        const response = await api.get(`/software/download/${item.id}`, {
          responseType: 'blob'
        });
        
        const fileName = `${item.name}.exe`;
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } catch (error) {
        console.error('Ошибка при скачивании:', error);
      }
    };


    fetchCategories();
    fetchItems();

    return {
      items,
      filteredItems,
      categories,
      searchTerm,
      selectedCategory,
      isMobile,
      handleSearch,
      handleCategorySelect,
      applyFilters,
      getCurrentCategoryName,
      handleItemAction,
    };
  }
});
</script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.main-layout {
    display: flex;
    width: 100%;
}

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 25.625rem;
    overflow-y: auto;
    z-index: 999;
    background-color: white;
    padding: 2.25rem 2.5625rem;
}

.content-area {
    margin-left: 25.625rem;
    flex-grow: 1;
    padding-bottom: 2rem;
}

.search-container {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    margin-top: 2.25rem;
    padding: 0 2.5625rem;
}

.resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(21rem, 1fr));
    gap: 1.5rem;
    width: 100%;
    padding: 0 2.5625rem;
}

.logo {
    height: 3.6875rem;
    width: 4.5rem;
    margin-right: 1.8125rem;
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

.no-data {
    font-size: 1.5rem;
    text-align: center;
    color: #666;
    width: 100%;
    grid-column: 1 / -1;
}


@media (max-width: 1200px) {
    .sidebar {
        width: 20rem;
    }
    .content-area {
        margin-left: 20rem;
    }
    .search-container {
        flex-direction: column;
        align-items: flex-start;
        padding-right: 0;
    }
    .search-container > * {
        margin-bottom: 1rem;
    }
    .logo {
        margin-right: 0;
    }
    .resources-grid {
        grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    }
    .selected-category h2 {
        font-size: 2rem;
    }
}

@media (max-width: 768px) {
    .main-layout {
        flex-direction: column;
    }
    .sidebar {
        display: none;
        width: 100%;
        position: absolute;
        padding-top: 5rem;
    }
    
    .sidebar.visible {
        display: block;
    }
    
    .content-area {
        margin-left: 0;
    }
    
    .search-container {
        margin-top: 1rem;
        padding-left: 1rem;
    }
    .logo {
        height: 3rem;
        width: auto;
    }
    .selected-category {
        padding: 1rem 1rem;
    }
    .selected-category h2 {
        font-size: 1.5rem;
    }
    .resources-grid {
        grid-template-columns: 1fr;
        padding: 0 1rem;
    }
    .main-container {
        width: 100%;
    }
    .burger-btn {
        display: block;
    }
}
</style>